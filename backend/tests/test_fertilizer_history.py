import unittest
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch
from bson import ObjectId
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pymongo.errors import ConnectionFailure
from app.features.fertilizer_guide import router as module

REQUEST = dict(crop="Tea", soil_type="Loamy soil", N=50, P=20, K=100, pH=5,
               moisture=58.7, temperature=19.9, EC=1.99, growth_stage="Mature production")
RESULT = {"inputs": REQUEST, "ml_predictions": {"organic": {"fertilizer": "Compost"}}, "application_rules": []}

class HistoryTests(unittest.TestCase):
    def setUp(self):
        app = FastAPI(); app.include_router(module.router)
        self.client = TestClient(app)
        self.collection = MagicMock()
        self.storage = patch.object(module, 'history_collection', return_value=self.collection)
        self.prediction = patch.object(module, 'recommend', return_value=RESULT)
        self.storage.start(); self.prediction.start()
        self.addCleanup(self.storage.stop); self.addCleanup(self.prediction.stop)

    def test_saves_full_prediction_and_timestamp(self):
        record_id = ObjectId()
        self.collection.insert_one.return_value.inserted_id = record_id
        response = self.client.post('/fertilizer-guide/recommend', json=REQUEST)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], str(record_id))
        self.assertTrue(response.json()['saved'])
        document = self.collection.insert_one.call_args.args[0]
        self.assertEqual(document['inputs'], REQUEST)
        self.assertEqual(document['application_rules'], [])
        self.assertEqual(document['created_at'].tzinfo, timezone.utc)

    def test_reopens_complete_result(self):
        record_id = ObjectId()
        self.collection.find_one.return_value = {**RESULT, '_id': record_id, 'created_at': datetime.now(timezone.utc)}
        response = self.client.get('/fertilizer-guide/history/' + str(record_id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['inputs'], REQUEST)
        self.assertEqual(response.json()['ml_predictions'], RESULT['ml_predictions'])
        self.assertTrue(response.json()['saved'])

    def test_pagination(self):
        cursor = self.collection.find.return_value.sort.return_value.skip.return_value
        cursor.limit.return_value = [{'_id': ObjectId(), **RESULT} for _ in range(3)]
        response = self.client.get('/fertilizer-guide/history?skip=20&limit=2')
        self.assertEqual(len(response.json()['items']), 2)
        self.assertTrue(response.json()['has_more'])
        self.collection.find.return_value.sort.return_value.skip.assert_called_once_with(20)
        self.assertEqual(self.client.get('/fertilizer-guide/history?limit=101').status_code, 422)

    def test_empty_history(self):
        self.collection.find.return_value.sort.return_value.skip.return_value.limit.return_value = []
        self.assertEqual(self.client.get('/fertilizer-guide/history').json(), {'items': [], 'has_more': False})

    def test_invalid_and_missing_id(self):
        self.collection.find_one.return_value = None
        self.assertEqual(self.client.get('/fertilizer-guide/history/bad').status_code, 400)
        self.assertEqual(self.client.get('/fertilizer-guide/history/' + str(ObjectId())).status_code, 404)

    def test_storage_failure_preserves_prediction(self):
        with patch.object(module, 'history_collection', side_effect=ConnectionFailure()):
            response = self.client.post('/fertilizer-guide/recommend', json=REQUEST)
            self.assertEqual(response.status_code, 200)
            self.assertFalse(response.json()['saved'])
            self.assertEqual(response.json()['ml_predictions'], RESULT['ml_predictions'])
            self.assertEqual(self.client.get('/fertilizer-guide/history').status_code, 503)
            self.assertEqual(self.client.get('/fertilizer-guide/history/' + str(ObjectId())).status_code, 503)
