"""Local research demo: XGBoost crop scores and per-crop Tree SHAP explanations."""
from pathlib import Path
from datetime import datetime, timezone
import json
import math
import os
import uuid

import numpy as np
import pandas as pd
import requests
import shap
from dotenv import load_dotenv
from xgboost import XGBClassifier

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT.parents[2] / '.env')
FEATURES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
LABELS = json.loads((ROOT / 'models' / 'crop_labels.json').read_text())
NAMES = {'N': 'Nitrogen', 'P': 'Phosphorus', 'K': 'Potassium', 'temperature': 'Temperature',
         'humidity': 'Humidity', 'ph': 'Soil pH', 'rainfall': 'Annual rainfall'}
# Broad input validation limits, not agronomic suitability rules.
LIMITS = {'N': (0, 10000), 'P': (0, 10000), 'K': (0, 10000), 'ph': (0, 14),
          'temperature': (-30, 60), 'humidity': (0, 100), 'rainfall': (0, 15000)}
model = XGBClassifier(n_jobs=1)
model.load_model(ROOT / 'models' / 'crop_xgboost_model.json')
if model.get_booster().feature_names != FEATURES or model.n_classes_ != len(LABELS):
    raise RuntimeError('Model features/classes do not match the accompanying metadata.')
explainer = shap.TreeExplainer(model)
training = pd.read_csv(ROOT / 'data' / 'Kegalle_Crop_Dataset.csv')
RANGES = {f: [float(training[f].min()), float(training[f].max())] for f in FEATURES}
SAMPLES = {crop: {f: float(training.loc[training.label == crop, f].median()) for f in FEATURES}
           for crop in LABELS}
def number(data, key):
    value = data.get(key)
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'{key} must be a finite number.')
    lo, hi = LIMITS[key]
    if not lo <= value <= hi:
        raise ValueError(f'{key} must be between {lo} and {hi}.')
    return float(value)


class WeatherUnavailable(Exception):
    pass


def get_realtime_weather():
    key = os.getenv('OPENWEATHER_API_KEY', '').strip()
    if not key:
        raise WeatherUnavailable('Live weather is not configured. Use manual weather or set OPENWEATHER_API_KEY.')
    try:
        response = requests.get('https://api.openweathermap.org/data/2.5/weather',
                                params={'q': 'Kegalle,LK', 'appid': key, 'units': 'metric'}, timeout=8)
        if response.status_code != 200:
            raise WeatherUnavailable('Weather provider is unavailable. Try again or use manual weather.')
        data = response.json()
        values = {'temperature': data['main']['temp'], 'humidity': data['main']['humidity']}
        values = {f: number(values, f) for f in values}
        return {**values, 'source': 'OpenWeatherMap', 'location': 'Kegalle, Sri Lanka',
                'observed_at': datetime.fromtimestamp(data['dt'], timezone.utc).isoformat(),
                'fetched_at': datetime.now(timezone.utc).isoformat()}
    except (requests.RequestException, KeyError, ValueError, TypeError, OverflowError):
        # Never include a provider exception URL: it may contain the API key.
        raise WeatherUnavailable('Could not obtain valid weather data. Try again or use manual weather.') from None


def health():
    return dict(status='ok', model='XGBoost', explainability='Tree SHAP', dataset='synthetic',
                   live_weather_configured=bool(os.getenv('OPENWEATHER_API_KEY', '').strip()))


def metadata():
    return dict(features=FEATURES, crops=LABELS, samples=SAMPLES, training_ranges=RANGES,
                   rainfall_basis='annual_demo_assumption', nutrient_units='unspecified_in_source_dataset',
                   message='Synthetic prototype; model scores are not measured field suitability.')


def predict_crop(data):
    if not isinstance(data, dict):
        return dict(status='error', message='Send a JSON object with the required inputs.'), 400
    try:
        mode = data.get('weather_mode', 'manual')
        if mode not in ('manual', 'live'):
            raise ValueError('weather_mode must be manual or live.')
        inputs = {f: number(data, f) for f in ['N', 'P', 'K', 'ph', 'rainfall']}
        if mode == 'live':
            weather = get_realtime_weather()
            inputs.update({f: weather[f] for f in ['temperature', 'humidity']})
        else:
            inputs.update({f: number(data, f) for f in ['temperature', 'humidity']})
            weather = {'source': 'Manual input', 'location': 'Kegalle, Sri Lanka',
                       'temperature': inputs['temperature'], 'humidity': inputs['humidity'], 'observed_at': None}
    except ValueError as error:
        return dict(status='error', message=str(error)), 400
    except WeatherUnavailable as error:
        return dict(status='error', message=str(error)), 503

    frame = pd.DataFrame([[inputs[f] for f in FEATURES]], columns=FEATURES)
    probabilities = model.predict_proba(frame)[0]
    raw_shap = explainer.shap_values(frame)
    values = np.stack(raw_shap, axis=-1) if isinstance(raw_shap, list) else np.asarray(raw_shap)
    if values.shape != (1, len(FEATURES), len(LABELS)):
        raise RuntimeError('Unexpected multiclass SHAP shape.')
    base = np.asarray(explainer.expected_value).reshape(-1)
    recommendations = []
    for index, crop in enumerate(LABELS):
        factors = sorted([{'feature': f, 'label': NAMES[f], 'value': inputs[f],
                           'shap_value': float(values[0, i, index]),
                           'direction': 'supports' if values[0, i, index] > 0 else
                                        'opposes' if values[0, i, index] < 0 else 'neutral'}
                          for i, f in enumerate(FEATURES)], key=lambda row: abs(row['shap_value']), reverse=True)
        positive = [f for f in factors if f['shap_value'] > 0][:2]
        negative = [f for f in factors if f['shap_value'] < 0][:1]
        parts = []
        if positive:
            parts.append(' and '.join(f"{f['label']} ({f['value']:g})" for f in positive) +
                         f" provide the strongest support for {crop} in this model.")
        else:
            parts.append(f'No input increased the score for {crop} above its model baseline.')
        if negative:
            parts.append(f"{negative[0]['label']} ({negative[0]['value']:g}) lowers its score.")
        recommendations.append({'crop': crop, 'probability': float(probabilities[index]),
                                'score_percent': round(float(probabilities[index]) * 100, 2),
                                'explanation': ' '.join(parts), 'factors': factors,
                                'base_value': float(base[index]),
                                'raw_margin': float(base[index] + values[0, :, index].sum())})
    recommendations.sort(key=lambda row: row['probability'], reverse=True)
    warnings = [f"{NAMES[f]} is outside the synthetic training range ({RANGES[f][0]:g}–{RANGES[f][1]:g})."
                for f in FEATURES if not RANGES[f][0] <= inputs[f] <= RANGES[f][1]]
    best = recommendations[0]
    return dict(status='success', analysis_id=str(uuid.uuid4()), created_at=datetime.now(timezone.utc).isoformat(),
                   recommended_crop=best['crop'], explanation=best['explanation'],
                   top_contributing_feature=best['factors'][0]['feature'], recommendations=recommendations,
                   inputs=inputs, weather=weather, warnings=warnings, dataset='synthetic',
                   score_type='uncalibrated_model_class_probability', shap_units='raw_model_margin',
                   rainfall_basis='annual_demo_assumption')


