"""Separate model attribution, lab comparisons, and fertilizer reference facts."""
from functools import lru_cache
import logging
import numpy as np
import shap

logger = logging.getLogger(__name__)
RRISL = {"title": "RRISL Rubber Handbook, tables 15.2 and 15.3", "url": "https://www.rrisl.gov.lk/content/files/downDoc/Handbook_Volume_1.pdf"}
TRI = {"title": "TRI: tea soil requirements", "url": "https://www.tri.lk/ceylon-tea/"}
TRI_LIME = {"title": "TRI: soil acidity and dolomite guidance", "url": "https://www.tri.lk/wp-content/uploads/2022/01/TRISL_Guideline_04_2021e_Dec2021_StrategicCostManagement.pdf"}
ROLES = {"N": "Nitrogen supports leaf development and vegetative growth.", "P": "Phosphorus supports root development and plant energy processes.", "K": "Potassium supports water regulation and crop development."}
SOURCES = {"N": "urea or another professionally selected nitrogen source", "P": "a professionally selected phosphate source", "K": "Muriate of Potash or another professionally selected potassium source"}


@lru_cache(maxsize=2)
# Reuse the SHAP calculator instead of rebuilding it for every request.
def tree_explainer(classifier):
    return shap.TreeExplainer(classifier, feature_perturbation="tree_path_dependent", model_output="raw")


# Explain which entered inputs moved the selected fertilizer probability up or down.
def model_attribution(model, frame, label):
    """Aggregate one-hot SHAP values to the original inputs for the selected class."""
    try:
        preprocess = model.named_steps['preprocess']
        classifier = model.named_steps['classifier']
        transformed = preprocess.transform(frame)
        if hasattr(transformed, 'toarray'):
            transformed = transformed.toarray()
        explainer = tree_explainer(classifier)
        raw = explainer.shap_values(transformed, check_additivity=True)
        index = list(model.classes_).index(label)
        contributions = np.asarray(raw[index][0] if isinstance(raw, list) else raw[0, :, index], dtype=float)
        base = float(np.asarray(explainer.expected_value)[index])
        encoder = preprocess.named_transformers_['categorical']
        # Combine encoded crop/soil columns back into the original input names.
        owners = []
        for column, categories in zip(['crop', 'soil_type'], encoder.categories_):
            owners.extend([column] * len(categories))
        owners.extend([column for column in frame.columns if column not in ('crop', 'soil_type')])
        if len(owners) != len(contributions):
            raise ValueError('Unexpected transformed feature layout')
        grouped = {column: 0.0 for column in frame.columns}
        for column, contribution in zip(owners, contributions):
            grouped[column] += float(contribution)
        probability = float(model.predict_proba(frame)[0, index])
        if not np.isclose(base + sum(grouped.values()), probability, atol=1e-6):
            raise ValueError('SHAP contributions do not reconstruct the selected probability')
        features = [{"feature": column, "value": frame.iloc[0][column].item() if hasattr(frame.iloc[0][column], 'item') else frame.iloc[0][column], "contribution": value,
                     "direction": "supports" if value > 1e-9 else "opposes" if value < -1e-9 else "neutral",
                     "assumed": column == 'EC'} for column, value in grouped.items()]
        features.sort(key=lambda item: abs(item['contribution']), reverse=True)
        supports = [item for item in features if item['direction'] == 'supports']
        strongest = ', '.join(f"{item['feature']} = {item['value']}" for item in supports[:3])
        summary = f"The model selected this fertilizer mainly because {strongest} supported this output relative to its baseline." if strongest else "The model selected this output, but no individual input increased its probability above the baseline."
        known_crops = encoder.categories_[0]
        if frame.iloc[0]['crop'] not in known_crops:
            summary = "This crop was not represented in the model's fitted crop categories. The output is outside its trained crop coverage and requires specialist review. " + summary
        return {"status": "available", "summary": summary, "base_probability": base, "predicted_probability": probability, "features": features,
                "note": "SHAP explains this model output, not a confirmed nutrient deficiency or fertilizer dose. EC uses the internal baseline 1.99. Growth stage and plant age affect application-rule matching, not the trained classifier."}
    except Exception:
        logger.exception('Fertilizer SHAP explanation unavailable')
        return {"status": "unavailable", "summary": "A reliable model explanation is unavailable for this result.", "features": [], "note": "Model contributions could not be calculated. No substitute attribution has been invented."}


# Describe ingredients and ratios separately from the amount to apply.
def composition(label, category):
    name = label.casefold()
    if category == 'organic':
        return {"summary": "Organic materials have variable nutrient contents. Their N:P:K ratio cannot be inferred from the name; use a material analysis.",
                "ingredients": [{"name": label, "share": "Variable", "role": "Adds organic matter; nutrient supply depends on material quality and decomposition."}],
                "ratio_note": "No fixed mixing ratio or guaranteed nutrient percentage is available.", "sources": []}
    if '15:15:7' in name:
        return {"summary": "R/U 15:15:7 contains 15% nitrogen (N), 15% phosphate expressed as P₂O₅, and 7% potash expressed as K₂O. These are nutrient grades, not raw-ingredient mixing ratios.",
                "ingredients": [{"name": "Urea", "share": "33 parts by weight", "role": ROLES['N']}, {"name": "Rock phosphate", "share": "55 parts by weight", "role": ROLES['P']}, {"name": "Muriate of Potash", "share": "12 parts by weight", "role": ROLES['K']}],
                "ratio_note": "RRISL reference blend: 33:55:12 by weight. This mixture is listed for Parambe soils; suitability also depends on plant stage and soil/leaf tests. Confirm the purchased product label.", "sources": [RRISL]}
    if '4:5:3' in name:
        cocoa = 'cocoa' in name
        parts = [4, 5, 3.5 if cocoa else 3, 1]
        ingredients = [{"name": material, "share": f"{part:g} parts by weight ({part/sum(parts)*100:.1f}%)", "role": role}
                       for material, part, role in zip(['Urea', 'Rock phosphate', 'Muriate of Potash', 'Kieserite'], parts, [ROLES['N'], ROLES['P'], ROLES['K'], 'Magnesium supports chlorophyll and photosynthesis.'])]
        return {"summary": "A four-material blend supplying nitrogen, phosphate, potash, and magnesium.", "ingredients": ingredients,
                "ratio_note": "Raw-material ratio from the supplied reference notes, pending independent DEA confirmation. Parts by weight are not nutrient percentages or application rates. Confirm the product formulation with DEA.", "sources": []}
    ingredients = []
    for token, material, role in [('urea', 'Urea', ROLES['N']), ('ammonia', 'Sulphate of ammonia', ROLES['N']), ('phosphate', 'Phosphate source; confirm ERP or other product on label', ROLES['P']), ('potassium', 'Potassium source; confirm product on label', ROLES['K']), ('potash', 'Muriate of Potash', ROLES['K'])]:
        if token in name:
            ingredients.append({"name": material, "share": "Confirm product label", "role": role})
    return {"summary": "No complete product formulation is verified for this output. Confirm the manufacturer label and crop-specific guidance.", "ingredients": ingredients,
            "ratio_note": "Any percentage stated in the output is label-reported nutrient content: N is nitrogen, P₂O₅ is phosphate, and K₂O is potash. Confirm the purchased label; a nutrient grade is not a raw-material mixing ratio or dose.", "sources": []}


# Compare readings only with targets for the same crop and growth stage.
def lab_assessment(values):
    reference = values.get('lab_reference')
    valid = bool(reference and reference['crop'] == values['crop'] and reference['growth_stage'] == values['growth_stage'])
    nutrients = []
    for key in ('N', 'P', 'K'):
        minimum = reference.get(key + '_min') if valid else None
        low = minimum is not None and values[key] < minimum
        nutrients.append({"nutrient": key, "value": values[key], "minimum": minimum,
                          "unit": reference['unit'] if valid else "unit not confirmed",
                          "status": "below supplied threshold" if low else "not below supplied threshold" if minimum is not None else "not assessed",
                          "explanation": (f"{key} is below the supplied crop/stage reference ({values[key]} < {minimum}). " + ROLES[key] + f" Confirm the result with your laboratory or adviser before considering additional {SOURCES[key]}. Increasing the whole blend can add other nutrients unnecessarily.") if low else ("This measurement is not below the supplied lower threshold. It does not justify increasing this ingredient, and an upper-limit assessment has not been made." if minimum is not None else "A crop-specific laboratory reference in matching units and test method is needed before calling this nutrient low.")})
    ph = values['pH']
    minimum = reference.get('pH_min') if valid else None
    maximum = reference.get('pH_max') if valid else None
    if minimum is not None and maximum is not None and minimum > maximum:
        minimum = maximum = None
    if values['crop'] == 'Tea' and minimum is None and maximum is None:
        minimum, maximum = 4.5, 5.5
    if minimum is not None and ph < minimum:
        ph_text = "Soil pH is below the applicable reference. A professional soil assessment should determine whether dolomite is appropriate and calculate its amount using soil acidity, buffering, and magnesium needs. Do not guess a dose from pH alone."
    elif maximum is not None and ph > maximum:
        ph_text = "Soil pH is above the applicable reference. Dolomite raises pH and should not be used to lower it. Ask a crop adviser to assess the cause before applying a pH amendment."
    else:
        ph_text = "If soil is excessively acidic for this crop, a professional assessment can determine whether dolomite is appropriate and calculate the required amount. pH alone does not establish a dolomite dose."
    return {"nutrients": nutrients, "reference": reference if valid else None,
            "reference_note": "Compared with the laboratory reference you supplied; its authority, units, method, and crop/stage applicability must be confirmed." if valid else "Your entered N, P and K values are shown below. Add crop- and growth-stage targets in matching measurement units to compare nutrient needs and plan any adjustment.",
            "pH": {"value": ph, "minimum": minimum, "maximum": maximum, "explanation": ph_text, "sources": [TRI, TRI_LIME] if values['crop'] == 'Tea' else []}}


# Build the readable explanation, input summary and monitoring plan for each option.
def explain(values, predictions, attributions):
    assessment = lab_assessment(values)
    context = (
        f"You entered {values['crop']} at the {values['growth_stage']} stage in {values['soil_type']}, "
        f"with N = {values['N']}, P = {values['P']}, K = {values['K']}, pH = {values['pH']}, "
        f"moisture = {values['moisture']}% and temperature = {values['temperature']} degrees C. "
        "The fertilizer option is generated from the crop, soil type and entered measurements; "
        "the growth stage is used separately to match application guidance."
    )
    monitoring = (
        "Live IoT readings are not connected yet; this result uses manually entered measurements. "
        "As a suggested observation plan, record readings regularly for at least one month, "
        "including dates, sampling locations, rainfall or irrigation and fertilizer applications. "
        "Review trends before revising the plan. One month of readings alone does not establish a fertilizer dose."
    )
    output = {}
    for category, prediction in predictions.items():
        label = prediction['fertilizer']
        withheld = category == 'inorganic' and any(phrase in label.casefold() for phrase in ['no routine', 'no verified', 'expert review'])
        output[category] = {"title": f"Why was {label} recommended?" if not withheld else "Why is inorganic fertilizer deferred?",
                            "composition": composition(label, category) if not withheld else {"summary": "This output does not identify an inorganic product to apply.", "ingredients": [], "ratio_note": "No product ratio or dose is assigned.", "sources": []},
                            "model": attributions[category], "assessment": assessment,
                            "input_summary": context, "monitoring_plan": monitoring,
                            "next_steps": [item['explanation'] for item in assessment['nutrients'] if item['minimum'] is not None] + [
                                "Use the ingredient breakdown below to understand what the product supplies. A mixing ratio describes composition, not how much to apply.",
                                "Adjust an individual nutrient only against an applicable crop target; do not increase every ingredient in a fixed blend to address one low value."],
                            "inorganic_note": "The model has deferred routine inorganic application; no verified crop/product prescription is established by this output." if withheld else "A predicted product is a candidate for review, not proof that inorganic fertilizer is necessary. Tests and professional guidance determine whether to use it."}
    return output
