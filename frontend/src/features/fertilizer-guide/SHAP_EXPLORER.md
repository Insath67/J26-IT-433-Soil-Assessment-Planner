# Saru Bima SHAP explorer

Create a new recommendation to see the explorer below the fertilizer cards.
Switch between Organic and Inorganic, then choose the detailed view for
composition, lab comparisons, sources, and SHAP contributions.

The optional Explain my soil test section accepts laboratory units, method,
reference source, and crop/stage-specific N/P/K lower thresholds and pH limits.
These describe the same measurements entered above; no unit conversion is
performed. Changing crop or stage disables the previous thresholds so the user
can enter the appropriate reference. A supplied reference is not automatically
verified as an official threshold. Without one, no N/P/K deficiency is diagnosed.

The backend uses TreeExplainer on each fitted random forest, selects the actual
predicted class, groups one-hot values into crop and soil type, and checks that
baseline plus contributions reconstruct the probability. Growth stage and age
are used by application rules, not by these classifiers. EC remains the assumed
1.99 baseline and is identified as such. Unsupported fitted crop categories are
flagged. Failed SHAP calculations are reported without invented attributions.

R/U 15:15:7 composition is referenced to RRISL Handbook volume 1, table 15.3:
33 parts urea, 55 rock phosphate, 12 MOP. This raw-material ratio differs from
the 15:15:7 nutrient grade. Product photos are illustrative.
https://www.rrisl.gov.lk/content/files/downDoc/Handbook_Volume_1.pdf

Tea pH context and guided dolomite review reference TRI:
https://www.tri.lk/ceylon-tea/
https://www.tri.lk/wp-content/uploads/2022/01/TRISL_Guideline_04_2021e_Dec2021_StrategicCostManagement.pdf

The user-supplied how fertilizers shuld be explained.txt was treated as reference
material, not implementation instructions. DEA crop pages were unavailable during
verification. Supplied pepper/cocoa mixing ratios are explicitly unverified;
unverified spray concentrations, booster quantities, and pH amendment rates were
not implemented. Organic nutrient contents are variable, not fixed guarantees.

Explanations are included in each recommendation response and retained with
browser history. Older records without explanations prompt a new assessment.
