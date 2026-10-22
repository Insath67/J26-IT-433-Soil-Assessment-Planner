# Soil Scan: image + IoT research prototype

## Current behavior

`POST /api/soil-scan/predict` remains the image-only EfficientNetB0 classifier.
It resizes RGB input to 224 × 224 and returns Clay, Loam, or Sand with the
image model's confidence and probabilities.

`GET /api/soil-scan/sensor-data` currently returns clearly marked demo readings.
`source` is `demo` and `connected` is `false`; these values do not represent an
ESP32 or a live sensor.

`POST /api/soil-scan/predict-multimodal` accepts multipart fields `file`, `ec`
(mS/cm), `moisture` (%), and `temperature` (°C). Its `image_prediction` is
produced by the existing image classifier. The response separately echoes the
validated sensor readings and sets `fusion.status` to `not_trained`. Sensor
values are not used to alter the image prediction or its probabilities.

Temperature bounds default to -10 °C through 80 °C and can be configured with
`SOIL_SCAN_TEMPERATURE_MIN_C` and `SOIL_SCAN_TEMPERATURE_MAX_C`.

## Future fusion architecture

The Soil Scan service keeps separate seams for `extract_image_features`,
`preprocess_sensor_features`, and `fuse_features`. The existing EfficientNetB0
pooled image vector can be extracted without replacing its classifier.
Sensor preprocessing currently validates and arranges EC, moisture, and
temperature; it deliberately does not apply guessed scaling. `fuse_features`
concatenates feature vectors as a future model input, but no trained fusion
classifier currently consumes that vector. The multimodal endpoint therefore
continues to report image-only classification and explicitly reports fusion as
not trained.

The intended trained model is an EfficientNetB0 image feature branch plus a
sensor MLP branch, concatenated and passed through trained dense classification
layers. Training and evaluation require paired image and sensor observations.

## Paired dataset and model comparison

The current image dataset (`train/`, `val/`, and `test/` folders by class) has
no paired IoT measurements. Do not infer or fabricate those measurements.
When paired observations are collected, a metadata file can use:

```csv
image_id,ec,moisture,temperature,soil_class
```

Keep image-only EfficientNetB0 (Model A), sensor-only ML (Model B), and
multimodal fusion (Model C) as separate evaluation tracks. Calculate accuracy,
precision, recall, F1-score, and confusion matrices only from documented,
held-out measured data. No multimodal performance is reported by this prototype.
