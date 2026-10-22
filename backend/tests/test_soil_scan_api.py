import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app


IMAGE_FILE = ("soil.jpg", b"image-bytes", "image/jpeg")
IMAGE_PREDICTION = {
    "status": "success",
    "predicted_class": "Loam",
    "class_id": 1,
    "confidence": 0.75,
    "probabilities": {"Clay": 0.1, "Loam": 0.75, "Sand": 0.15},
}


class SoilScanApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_sensor_data_is_explicitly_demo(self):
        response = self.client.get("/api/soil-scan/sensor-data")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["source"], "demo")
        self.assertFalse(data["connected"])
        self.assertEqual(
            data["sensor_data"],
            {"ec": 1.24, "moisture": 62.0, "temperature": 28.4},
        )

    @patch("app.features.soil_scan.router.predict_soil", return_value=IMAGE_PREDICTION)
    def test_existing_image_prediction_endpoint(self, predict_soil):
        response = self.client.post(
            "/api/soil-scan/predict",
            files={"file": IMAGE_FILE},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), IMAGE_PREDICTION)
        predict_soil.assert_called_once_with(b"image-bytes")

    @patch(
        "app.features.soil_scan.router.predict_multimodal",
        return_value={
            "status": "success",
            "mode": "image_plus_iot",
            "image_prediction": IMAGE_PREDICTION,
            "sensor_data": {"ec": 1.42, "moisture": 38.5, "temperature": 27.4},
            "fusion": {
                "status": "not_trained",
                "message": "Multimodal fusion model is prepared for training.",
            },
        },
    )
    def test_multimodal_request_reports_untrained_fusion(self, predict_multimodal):
        response = self.client.post(
            "/api/soil-scan/predict-multimodal",
            files={"file": IMAGE_FILE},
            data={"ec": "1.42", "moisture": "38.5", "temperature": "27.4"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["mode"], "image_plus_iot")
        self.assertEqual(data["image_prediction"], IMAGE_PREDICTION)
        self.assertEqual(data["sensor_data"]["ec"], 1.42)
        self.assertEqual(data["fusion"]["status"], "not_trained")
        predict_multimodal.assert_called_once()

    def test_multimodal_sensor_ranges_are_validated(self):
        for sensor_data in (
            {"ec": "-0.1", "moisture": "50", "temperature": "20"},
            {"ec": "1", "moisture": "100.1", "temperature": "20"},
            {"ec": "1", "moisture": "50", "temperature": "81"},
        ):
            with self.subTest(sensor_data=sensor_data):
                response = self.client.post(
                    "/api/soil-scan/predict-multimodal",
                    files={"file": IMAGE_FILE},
                    data=sensor_data,
                )
                self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
