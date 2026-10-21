"""Fertilizer prediction + age-aware rule matching + guaranteed crop-stage method fallback.
Keep trained joblib models unchanged. CSV: data/fertilizer_application_rules.csv.
"""
from functools import lru_cache
from pathlib import Path
import re
import joblib
import pandas as pd

BASE = Path(__file__).resolve().parent
FEATURES = ['crop', 'soil_type', 'N', 'P', 'K', 'pH', 'moisture', 'temperature', 'EC']


def norm(value):
    return ' '.join(str(value or '').casefold().split())


def age_ok(age_text, age):
    if age is None or not str(age_text).strip() or norm(age_text) in ('any', 'all'):
        return True
    t = norm(age_text)
    try:
        age = float(age)
    except (TypeError, ValueError):
        return False
    if 'month' in t:
        m = re.search(r'(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)', t)
        return bool(m and float(m.group(1))/12 <= age <= float(m.group(2))/12)
    m = re.search(r'(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)', t)
    if m:
        return float(m.group(1)) <= age <= float(m.group(2))
    m = re.search(r'(\d+(?:\.\d+)?)\s*\+', t)
    if m:
        return age >= float(m.group(1))
    m = re.search(r'(?:approx\.?\s*year\s*)?(\d+(?:\.\d+)?)', t)
    return bool(m and abs(age - float(m.group(1))) < 0.5)


def series_ok(rule_series, requested_series):
    if not str(rule_series).strip():
        return True
    if not requested_series:
        return False  # Never assign soil-series-specific doses without confirmation.
    return any(norm(requested_series) == norm(option) for option in str(rule_series).split('/')) or norm(requested_series) in norm(rule_series)


@lru_cache(maxsize=1)
def resources():
    organic = joblib.load(BASE / 'models' / 'organic_fertilizer_model.joblib')
    inorganic = joblib.load(BASE / 'models' / 'inorganic_fertilizer_model.joblib')
    rules = pd.read_csv(BASE / 'data' / 'fertilizer_application_rules.csv', keep_default_na=False)
    required = {'crop', 'growth_stage', 'fertilizer', 'prediction_label', 'rule_type', 'plant_age', 'soil_series', 'annual_quantity'}
    missing = required.difference(rules.columns)
    if missing:
        raise ValueError(f'Application rules CSV missing columns: {sorted(missing)}. Use fertilizer_application_rules_coverage.csv.')
    return organic, inorganic, rules


def matching_rules(rules, crop, stage, label, age=None, soil_series=None):
    """Prefer an age/series-compatible specific rule; otherwise return general method only."""
    subset = rules[(rules['crop'].map(norm) == norm(crop)) & (rules['growth_stage'].map(norm) == norm(stage))]
    subset = subset[subset.apply(lambda r: age_ok(r['plant_age'], age), axis=1)]
    def matches(r):
        aliases = [norm(x) for x in str(r['prediction_label']).split('|') if x.strip()]
        return norm(label) in aliases or norm(label) == norm(r['fertilizer'])
    matched = subset[subset.apply(matches, axis=1)]
    specific = matched[(matched['rule_type'] == 'fertilizer_specific') & matched.apply(lambda r: series_ok(r['soil_series'], soil_series), axis=1)]
    # Do not return a different fertilizer's dose. Generic guidance is always dose-free.
    general = matched[matched['rule_type'] == 'general_method']
    if not specific.empty:
        return specific.to_dict('records'), general.head(1).to_dict('records')
    return [], general.head(1).to_dict('records')


def recommend(inputs):
    organic, inorganic, rules = resources()
    values = inputs.model_dump()
    frame = pd.DataFrame([{k: values[k] for k in FEATURES}], columns=FEATURES)
    predictions = {}
    for category, model in [('organic', organic), ('inorganic', inorganic)]:
        label = str(model.predict(frame)[0])
        probability = float(model.predict_proba(frame).max(axis=1)[0]) if hasattr(model, 'predict_proba') else None
        predictions[category] = {'fertilizer': label, 'model_probability': probability}
    matched, guidance, unmatched = [], [], []
    for category, prediction in predictions.items():
        label = prediction['fertilizer']
        exact, fallback = matching_rules(rules, inputs.crop, inputs.growth_stage, label, inputs.plant_age_years, inputs.soil_series or (inputs.soil_type if inputs.crop.casefold() == 'cocoa' else None))
        matched.extend(exact)
        if fallback:
            guidance.append({'category': category, 'fertilizer': label, **fallback[0]})
        if not exact:
            unmatched.append({'category': category, 'fertilizer': label, 'message': 'Crop-stage application guidance is provided. A fertilizer-specific dose is not established for these inputs.', 'available_rules': fallback})
    unique = {str(r['rule_id']): r for r in matched}
    return {
        'inputs': values, 'ml_predictions': predictions,
        'application_rules': list(unique.values()),
        'general_application_guidance': guidance[0] if guidance else None,
        'application_guidance_by_category': guidance,
        'unmatched_recommendations': unmatched,
        'additional_amendment_reference': [],
        'warnings': [
            'Synthetic training labels are not field-validated fertilizer prescriptions.',
            'NPK measurement units and deficiency thresholds require validation.',
            'General application methods do not establish a fertilizer dose; provisional rates need agronomic confirmation.'
        ]
    }
