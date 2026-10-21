
from app.features.soil_health.schemas import SensorData
from app.features.soil_health.service import (
    evaluate_nutrient_status,
)


def recommend_fertilizer(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    ph: float,
):
    data = SensorData(
        nitrogen=nitrogen,
        phosphorus=phosphorus,
        potassium=potassium,
        ph=ph,
    )

    status = evaluate_nutrient_status(data)
    recommendations = []

    if status["nitrogen"] == "Deficient":
        recommendations.append({
            "nutrient": "Nitrogen",
            "suggestion": (
                "Nitrogen deficiency detected. "
                "Assess crop-specific nitrogen fertilizer "
                "requirements before applying urea."
            ),
        })

    if status["phosphorus"] == "Deficient":
        recommendations.append({
            "nutrient": "Phosphorus",
            "suggestion": (
                "Phosphorus deficiency detected. "
                "Consider a suitable phosphorus source "
                "after checking soil pH and crop needs."
            ),
        })

    if status["potassium"] == "Deficient":
        recommendations.append({
            "nutrient": "Potassium",
            "suggestion": (
                "Potassium deficiency detected. "
                "Review crop-specific potassium requirements."
            ),
        })

    if ph < 5.5:
        recommendations.append({
            "nutrient": "Soil pH",
            "suggestion": (
                "Acidic soil detected. Check the target crop "
                "and laboratory lime requirement before "
                "making a pH correction."
            ),
        })

    if not recommendations:
        recommendations.append({
            "nutrient": "General",
            "suggestion": (
                "No deficiency was detected using the "
                "current screening thresholds. Confirm "
                "with laboratory testing."
            ),
        })

    return {
        "nutrient_status": status,
        "recommendations": recommendations,
        "method": "Rule-based nutrient screening",
    }
