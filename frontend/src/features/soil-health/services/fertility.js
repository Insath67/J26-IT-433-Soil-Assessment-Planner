
/*
 * Soil Fertility Classification
 * Research prototype using N, P, K and pH.
 *
 * IMPORTANT:
 * Thresholds are provisional and must be validated
 * against local soil laboratory measurements.
 */

export function assessFertility({
  nitrogen,
  phosphorus,
  potassium,
  ph,
}) {
  const n = Number(nitrogen);
  const p = Number(phosphorus);
  const k = Number(potassium);
  const soilPh = Number(ph);

  if (
    [nitrogen, phosphorus, potassium, ph].some(
      (value) => value === null ||
        value === undefined ||
        value === ""
    ) ||
    ![n, p, k, soilPh].every(Number.isFinite)
  ) {
    return {
      level: "Unknown",
      score: null,
    };
  }

  // Provisional reference values
  const nScore = Math.min(100, Math.max(0, (n / 120) * 100));
  const pScore = Math.min(100, Math.max(0, (p / 45) * 100));
  const kScore = Math.min(100, Math.max(0, (k / 80) * 100));

  let phScore;

  if (soilPh >= 5.5 && soilPh <= 6.5) {
    phScore = 100;
  } else if (soilPh >= 5.0 && soilPh < 5.5) {
    phScore = 70;
  } else if (soilPh > 6.5 && soilPh <= 7.5) {
    phScore = 70;
  } else {
    phScore = 30;
  }

  const score = Math.round(
    nScore * 0.30 +
    pScore * 0.25 +
    kScore * 0.25 +
    phScore * 0.20
  );

  let level;

  if (score < 50) {
    level = "Low";
  } else if (score < 75) {
    level = "Medium";
  } else {
    level = "High";
  }

  return {
    level,
    score,
  };
}
