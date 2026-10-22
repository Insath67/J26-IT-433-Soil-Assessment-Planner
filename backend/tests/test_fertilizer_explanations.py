import unittest
import warnings
import numpy as np
import pandas as pd
from pydantic import ValidationError
from app.features.fertilizer_guide.explanations import composition, lab_assessment, model_attribution, explain
from app.features.fertilizer_guide.schemas import LabReference
from app.features.fertilizer_guide.service import resources, FEATURES

VALUES = dict(crop='Rubber', soil_type='Red-Yellow Podzolic (Ultisol)', N=20, P=20, K=100, pH=4.0, moisture=58.7, temperature=25, EC=1.99, growth_stage='Immature')
REFERENCE = dict(unit='mg/kg', method='Lab extraction method', source='Crop adviser report', crop='Rubber', growth_stage='Immature', N_min=30, P_min=10, K_min=100, pH_min=4.5, pH_max=5.5)

class ExplanationTests(unittest.TestCase):
    def test_no_reference_does_not_diagnose_low(self):
        result = lab_assessment(VALUES)
        self.assertTrue(all(row['status'] == 'not assessed' for row in result['nutrients']))
        self.assertTrue(all(row['minimum'] is None for row in result['nutrients']))

    def test_thresholds_boundaries_and_targeted_advice(self):
        result = lab_assessment({**VALUES, 'lab_reference': REFERENCE})
        n, p, k = result['nutrients']
        self.assertEqual(n['status'], 'below supplied threshold')
        self.assertIn('urea', n['explanation'])
        self.assertEqual(p['status'], 'not below supplied threshold')
        self.assertEqual(k['status'], 'not below supplied threshold')
        self.assertIn('dolomite', result['pH']['explanation'])
        high = lab_assessment({**VALUES, 'pH': 6, 'lab_reference': REFERENCE})
        self.assertIn('should not be used to lower', high['pH']['explanation'])

    def test_wrong_crop_or_stage_does_not_use_reference(self):
        for key, value in [('crop', 'Tea'), ('growth_stage', 'Planting')]:
            result = lab_assessment({**VALUES, 'lab_reference': {**REFERENCE, key: value}})
            self.assertTrue(all(row['status'] == 'not assessed' for row in result['nutrients']))

    def test_reference_validation(self):
        for fields in [{'unit': '  '}, {'pH_min': 6, 'pH_max': 5}, {'N_min': -1}]:
            with self.assertRaises(ValidationError): LabReference(**{**REFERENCE, **fields})

    def test_composition_distinguishes_grade_and_raw_ratio(self):
        result = composition('R/U 15:15:7 (Parambe-series candidate; confirm soil series)', 'inorganic')
        self.assertIn('15% nitrogen', result['summary'])
        self.assertEqual([row['share'] for row in result['ingredients']], ['33 parts by weight', '55 parts by weight', '12 parts by weight'])
        organic = composition('Compost', 'organic')
        self.assertIn('variable', organic['summary'])

    def test_guidance_uses_inputs_and_discloses_pending_iot(self):
        predictions = {'inorganic': {'fertilizer': 'Urea'}}
        result = explain(VALUES, predictions, {'inorganic': {}})['inorganic']
        self.assertIn('N = 20', result['input_summary'])
        self.assertIn('Rubber', result['input_summary'])
        self.assertIn('at least one month', result['monitoring_plan'])
        self.assertIn('not connected yet', result['monitoring_plan'])
        self.assertFalse(any('below the supplied' in step for step in result['next_steps']))
        compared = explain({**VALUES, 'lab_reference': REFERENCE}, predictions, {'inorganic': {}})['inorganic']
        self.assertTrue(any('20 < 30' in step and 'urea' in step for step in compared['next_steps']))

    def test_real_model_shap_additivity_for_both_classifiers(self):
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            organic, inorganic, _ = resources()
        for crop in ['Tea', 'Rubber', 'Pepper', 'Vanilla', 'Cocoa']:
            frame = pd.DataFrame([{key: {**VALUES, 'crop': crop}[key] for key in FEATURES}], columns=FEATURES)
            for model in [organic, inorganic]:
                with self.subTest(crop=crop, model=id(model)):
                    label = str(model.predict(frame)[0])
                    result = model_attribution(model, frame, label)
                    self.assertEqual(result['status'], 'available')
                    self.assertEqual(set(row['feature'] for row in result['features']), set(FEATURES))
                    self.assertAlmostEqual(result['base_probability'] + sum(row['contribution'] for row in result['features']), result['predicted_probability'], places=6)
                    index = list(model.classes_).index(label)
                    self.assertAlmostEqual(result['predicted_probability'], float(model.predict_proba(frame)[0, index]), places=6)
                    ec = next(row for row in result['features'] if row['feature'] == 'EC')
                    self.assertTrue(ec['assumed'])
