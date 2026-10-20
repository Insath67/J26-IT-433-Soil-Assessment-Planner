from functools import lru_cache
from pathlib import Path
import pandas as pd
import joblib

BASE = Path(__file__).resolve().parent
FEATURES = ['crop','soil_type','N','P','K','pH','moisture','temperature','EC']

@lru_cache(maxsize=1)
def resources():
    organic = joblib.load(BASE/'models/organic_fertilizer_model.joblib')
    inorganic = joblib.load(BASE/'models/inorganic_fertilizer_model.joblib')
    rules = pd.read_csv(BASE/'data/fertilizer_application_rules.csv').fillna('')
    return organic, inorganic, rules

def recommend(inputs):
    organic, inorganic, rules = resources()
    values = inputs.model_dump()
    frame = pd.DataFrame([{k: values[k] for k in FEATURES}], columns=FEATURES)
    predictions = {}
    for category, model in [('organic',organic),('inorganic',inorganic)]:
        label = str(model.predict(frame)[0])
        probability = float(model.predict_proba(frame).max(axis=1)[0]) if hasattr(model,'predict_proba') else None
        predictions[category] = {'fertilizer':label,'model_probability':probability}
    stage_rules = rules[(rules.crop.str.casefold() == inputs.crop.casefold()) & (rules.growth_stage.str.casefold() == inputs.growth_stage.casefold())]
    matched = []
    unmatched = []
    for category, prediction in predictions.items():
        name = prediction['fertilizer'].casefold().strip()
        matches = stage_rules[stage_rules.fertilizer.astype(str).str.casefold().str.strip() == name]
        if inputs.fertilizer_for_lookup:
            matches = stage_rules[stage_rules.fertilizer.astype(str).str.casefold().str.strip() == inputs.fertilizer_for_lookup.casefold().strip()]
        if inputs.soil_series:
            matches = matches[(matches.soil_series == '') | matches.soil_series.astype(str).str.contains(inputs.soil_series,case=False,regex=False)]
        matched.extend(matches.to_dict('records'))
        if matches.empty:
            unmatched.append({'category':category,'message':'No verified exact application rule for this predicted fertilizer and growth stage. Do not infer a dosage.','available_rules':stage_rules.head(8).to_dict('records')})
    unique = {str(r['rule_id']):r for r in matched}
    return {'inputs':values,'ml_predictions':predictions,'application_rules':list(unique.values()),'unmatched_recommendations':unmatched,'additional_amendment_reference':[], 'warnings':['Research prototype based on synthetic training data; not a field prescription.','NPK units and model calibration require verification before agronomic use.','Only exact reference matches include application rates.']}
