"""Fallback application guidance, not a substitute for verified product-specific dosing.
Usage: from application_guidance import get_application_guidance
"""
import csv
from pathlib import Path

RULES_FILE = Path(__file__).with_name('fertilizer_application_rules_five_crops_updated.csv')


def get_application_guidance(crop, growth_stage, fertilizer=None, plant_age_years=None):
    with RULES_FILE.open(encoding='utf-8-sig', newline='') as handle:
        rules = list(csv.DictReader(handle))
    matches = [r for r in rules if r['crop'].casefold() == str(crop).casefold()]
    stage_matches = [r for r in matches if r['growth_stage'].casefold() == str(growth_stage).casefold()]
    if stage_matches:
        matches = stage_matches
    if plant_age_years is not None:
        age = float(plant_age_years)
        age_matches = [r for r in matches if r['plant_age'].strip() == str(int(age)) or
                       (r['plant_age'].strip() == '3+' and age >= 3)]
        if age_matches:
            matches = age_matches
    if not matches:
        return {'crop': crop, 'growth_stage': growth_stage, 'status': 'crop_not_in_rules',
                'explanation': 'No crop-specific application method is in the reference data; obtain local agronomic guidance.'}
    exact = [r for r in matches if fertilizer and r['fertilizer'].casefold().strip() == str(fertilizer).casefold().strip()]
    chosen = exact[0] if exact else matches[0]
    result = {'crop':crop, 'growth_stage':growth_stage,
              'fertilizer_requested':fertilizer,
              'application_method':chosen['application_method'],
              'timing':chosen['timing'],
              'cautions':chosen['conditions_and_cautions'],
              'method_source':chosen['source'],
              'matched_exact_fertilizer':bool(exact)}
    if exact and chosen['annual_quantity'].strip():
        result.update(status='fertilizer_specific_rule', annual_quantity=chosen['annual_quantity'],
                      quantity_unit=chosen['quantity_unit'],
                      quantity_per_application=chosen['quantity_per_application'],
                      application_unit=chosen['application_unit'],
                      frequency=chosen['applications_per_year'],
                      verification_status=chosen['verification_status'])
    else:
        result.update(status='method_only', annual_quantity=None,
                      explanation='Application technique is provided for this crop and stage. A safe numeric dose cannot be inferred for the predicted fertilizer without a matching product-specific rule and relevant soil-test information.',
                      available_reference_fertilizers=sorted({r['fertilizer'] for r in matches}))
    return result

if __name__ == '__main__':
    from pprint import pprint
    pprint(get_application_guidance('Cocoa','Establishment','Cocoa NPKMg blend (Urea:Rock Phosphate:MOP:Kieserite = 4:5:3.5:1)',1))
