SARU BIMA — CROP FINDER
Image Processing & ML-based Soil Assessment and Crop 
Recommendation (Sri Lanka) 

Component Owner: Sasanka Karindra Bandara
Compnent : Climate-Aware Machine Learning Based Crop Recommendation  
Student ID: IT23343252
Documentation Updated: 29 October 2026

Repository:
https://github.com/Insath67/J26-IT-433-Soil-Assessment-Planner
Component branch: crop-recommendation-sasanka

DOCUMENTATION SCOPE
===================
This document describes Crop Finder using the implementation information
shared by the component owner. It is not an audit of the latest repository.
Implemented workflows, checks still required and planned extensions are
identified separately. Listing a feature as planned does not implement it.

1. OVERVIEW
===========
Crop Finder is the crop recommendation component of Saru Bima. It combines
soil nutrient values and environmental inputs to rank candidate crops using
XGBoost. Tree SHAP explains how the inputs influence individual crop scores.

The user interface includes English, Sinhala and Tamil language support,
light and dark themes, crop photographs and an analysis-report workflow.

Access the component through Home > Crop Finder:
http://localhost:5173/crop-finder

A planned extension will provide continued support after a farmer chooses
to cultivate a recommended crop. It will offer consent-based SMS alerts for
relevant weather hazards, pest risks and crop-management advice, together
with an optional request for agricultural technical officer assistance.
This extension is not yet documented as implemented.

2. RESEARCH PROBLEM AND OBJECTIVES
==================================
Crop selection depends on both soil and environmental conditions. Farmers
also need understandable reasons for recommendations and timely support
when conditions change after planting.

The component investigates:
- Combining soil and weather variables in crop recommendation.
- Ranking alternatives rather than providing only one crop label.
- Explaining recommendations through Tree SHAP.
- Delivering accessible, multilingual information.
- Integrating upstream soil information and future field measurements.
- Extending support from crop selection to post-planting risk communication.

The post-planting extension is a proposed research direction. Claims of
novelty and effectiveness require literature comparison and evaluation.
Regional agronomic suitability requires independent field validation.

3. SHARED APPLICATION ARCHITECTURE
==================================
The project has one React frontend and one FastAPI backend, with separate
feature folders for Soil Scan, Soil Health, Crop Finder and Fertilizer Guide.
Language selection, navigation, themes and design tokens are shared.

Current prediction workflow:
1. The user enters inputs or loads an available dataset example.
2. The frontend submits a prediction request.
3. The backend validates and prepares the inputs.
4. Live mode retrieves temperature and humidity from OpenWeather.
5. XGBoost produces class probabilities and crops are ranked.
6. Tree SHAP calculates feature contributions for the same inputs.
7. The API returns results, explanations and analysis context.
8. The frontend displays crop cards and explanations.

The backend loads saved models; it does not retrain on every request.
Other members maintain the implementation details of their own modules.

4. TECHNOLOGIES AND DEPENDENCIES
================================
Frontend:
React, Vite, React Router, react-i18next/i18next, shared CSS/Tailwind design
tokens, shared UI components and Lucide icons.

Crop Finder backend:
Python 3.12, FastAPI, Uvicorn, NumPy, pandas, XGBoost, SHAP, Requests and
python-dotenv.

Shared storage:
MongoDB Atlas and PyMongo.

Other shared backend dependencies:
TensorFlow and Pillow for the Soil Scan integration. These are not the
Crop Finder prediction model, but their imports can affect shared startup.

Use versions tested with the team's saved models. Keep dependency files
updated; installing the latest package alone does not prove compatibility.

5. IMPORTANT FILES
===================
All paths below are relative to the repository root.

frontend/src/features/crop-finder/App.jsx
    Crop dashboard, form and prediction interaction.
frontend/src/features/crop-finder/App.css
    Crop Finder layout and styles.
frontend/src/features/crop-finder/CropExplanation.jsx
    User-facing explanation panel introduced during UI updates.
frontend/src/features/crop-finder/translations.js
    Translation resources where stored as a file; some revisions may use
    a translations directory instead.

backend/app/features/crop_finder/router.py
    Crop Finder API endpoints.
backend/app/features/crop_finder/service.py
    Model loading, input processing, weather retrieval and explanations.
backend/app/features/crop_finder/models/crop_xgboost_model.json
    Trained XGBoost model.
backend/app/features/crop_finder/models/crop_labels.json
    Crop labels matching the model's class output order.
backend/app/features/crop_finder/models/correct_label_encoder.pkl
    Training label encoder artifact.
backend/app/features/crop_finder/data/Kegalle_Crop_Dataset.csv
    Prototype dataset.

Shared files:
frontend/src/App.jsx                  Application routes
frontend/src/pages/HomePage.jsx       Homepage
frontend/src/shared/Navigation.jsx    Navigation and shared controls
frontend/src/shared/Footer.jsx        Shared footer
frontend/src/i18n/index.js             Language configuration
frontend/src/globals.css              Colors, typography and theme tokens
frontend/src/components/ui/           Shared UI components
frontend/src/services/api.js          Shared request helper
frontend/vite.config.js               Development proxy configuration
backend/app/main.py                   Shared FastAPI entry point
backend/app/database.py               MongoDB connection/initialization
backend/requirements.txt              Backend dependencies
docs/                                Supporting team/research documentation

6. MODEL INPUTS AND INTERPRETATION
==================================
The current model expects these seven features in this order:
N, P, K, temperature, humidity, ph, rainfall

N, P, K: Soil nutrient values. Their units and measurement methods must be
verified and consistent between training and inference.
temperature: Degrees Celsius.
humidity: Relative humidity percentage.
ph: Soil pH.
rainfall: Value using the same time basis as the training data.

The service calls model.predict_proba(frame) and ranks candidate crops.
shap.TreeExplainer(model) explains that same XGBoost model.

SHAP is an explanation method, not a second crop classifier.
Scores are uncalibrated model class probabilities unless calibration is
implemented and evaluated. They are not guaranteed crop-success or yield
percentages. SHAP values in the inspected implementation use raw model-margin
units, not percentage-point probability changes.

A positive contribution supports that crop's model score; a negative
contribution reduces it relative to the explanation baseline. Neither is
proof of agricultural causation or a fertilizer/pesticide prescription.

Soil type and EC are not direct features of this seven-input model.
To include them in inference, update the training data, preprocessing,
feature definition, saved model, validation and API contract together.

7. WEATHER MODES
================
Manual mode:
- Accepts soil and environmental values supplied in the request.
- Supports demonstrations using available dataset examples.
- An example from a CSV is not a live sensor observation.

Live mode:
- Requests current weather from OpenWeather.
- Uses the returned temperature and humidity.
- Keeps soil values and rainfall separately supplied.
- Requires OPENWEATHER_API_KEY in backend/.env.

The prototype uses an annual-rainfall assumption. Confirm the dataset's
actual temporal meaning before introducing field or weather measurements.
Hourly rainfall must not be substituted for annual rainfall.

Current weather and long-term climate summaries are different inputs.
Evaluate whether their time scales match the intended recommendation task.
A current-weather request does not provide future hazard or pest forecasts.

A configured key does not prove that the key is valid. Submit a new analysis
after changing inputs. The same top crop can remain selected even when its
score and SHAP factors change.

8. OUTPUTS AND INTERFACE
========================
The developed workflow includes ranked crops, a highlighted top result,
model scores, photographs, a crop-detail popup, per-crop explanations,
input values and warnings where supported by the response.

UI updates cover multilingual text, light/dark themes, a centered input
form, improved explanation summaries and responsive presentation.

PDF export functionality has been introduced during frontend updates.
Verify the current export action: the original version exported JSON.
If the report uses a browser print dialog, select Save as PDF.
Check the selected language, Sinhala/Tamil font rendering, page breaks,
actual inputs and selected crop. Report output requires runtime verification.

9. FIRST-TIME SETUP — WINDOWS
=============================
Open the repository root in VS Code.
Prerequisites: Git, Python 3.12, Node/npm compatible with package.json,
MongoDB project access and an OpenWeather key for live mode.

Terminal 1 — Frontend:

cd frontend
npm.cmd ci
npm.cmd run dev

Open http://localhost:5173 and keep the terminal running.
npm.cmd avoids the PowerShell npm.ps1 execution-policy issue.

Terminal 2 — Backend, starting at the repository root:

cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Create .venv only when it does not exist. Do not copy a virtual environment
from another computer. Activation is optional when using its Python path.
Configure .env before starting the API.

10. ENVIRONMENT AND DATABASE CONFIGURATION
==========================================
From backend, create/open .env without overwriting an existing file:

if (!(Test-Path .env)) {
    New-Item -Path .env -ItemType File
}
code .env

Set actual private values:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB=YOUR_TEAM_DATABASE_NAME
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Replace placeholders. Confirm the database name with the team; earlier
shared code defaulted to soil_assessment_db.

A missing .env.example does not prevent direct creation of .env.
Never commit credentials. An .env.example should contain placeholders only.
Replace exposed credentials and update affected environments privately.

MongoDB requirements:
- Available cluster.
- Current public IP permitted in the project's IP access list.
- Valid database-user credentials and required permissions.
- Network access to the database nodes.

The shared application initializes the database at startup. A database
failure can therefore prevent every module from starting.
A standalone MongoDB ping succeeded during troubleshooting. This does not
by itself verify application startup, index creation or data persistence.
A 20-second server-selection timeout was recommended after a 5-second
failure; confirm the setting in app/database.py.

11. RUN THE APPLICATION
========================
From backend:

.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Wait for Application startup complete.
A preliminary Uvicorn running message followed by a traceback is not a
successful startup.

Keep the existing development ports:
Frontend: 5173
Backend: 8000

Useful addresses:
http://localhost:5173/
http://localhost:5173/crop-finder
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/api/health
http://127.0.0.1:8000/api/crop-finder/health

On subsequent runs, start npm.cmd run dev from frontend and the Uvicorn
command from backend. Reinstall dependencies when dependency files change.
Stop either process with Ctrl+C.

Linux/macOS backend equivalents:
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Use npm ci and npm run dev for the frontend.

12. CROP FINDER API
===================
GET /api/health
    Shared health endpoint.
GET /api/crop-finder/health
    Component health/configuration information.
GET /api/crop-finder/metadata
    Input metadata and available examples.
POST /api/crop-finder/predict
    Ranked predictions and explanations.

Example manual request body:
{
  "N": 130,
  "P": 25,
  "K": 70,
  "temperature": 23,
  "humidity": 80,
  "ph": 5.2,
  "rainfall": 2300,
  "weather_mode": "manual"
}

These values are demonstration inputs, not field observations.
Live mode uses weather_mode: "live" and obtains temperature/humidity in the
backend. Check the current schema before changing request/response fields.

13. COMPONENT INTEGRATION
==========================
Soil Scan:
Supply classification context. Using soil type as a predictor requires
retraining; adding a UI field alone does not change the current model.

Soil Health:
Agree on input names, units, sample IDs, timestamps and quality indicators.
Distinguish measured values from predicted/estimated values. Do not silently
replace absent readings with demonstration values.

Fertilizer Guide:
Agree on a handoff containing selected crop, sample ID, soil values, units,
timestamp and source information. SHAP contributions are not fertilizer doses.

IoT:
End-to-end real sensor integration remains pending confirmation. Check device
identity, data freshness, calibration context and missing/out-of-range values.

Storage:
Shared MongoDB connectivity does not prove that Crop Finder analyses are
saved. Verify persistence, retrieval and sample linking independently.

14. PLANNED EXTENSION — CROP ALERTS AND OFFICER SUPPORT
======================================================
Status: Proposed; not yet implemented or validated.

Purpose:
Support farmers after they choose to cultivate a recommended crop by
providing relevant SMS alerts and optional agricultural officer assistance.

Proposed farmer journey:
1. Review the crop recommendation and choose the crop actually being planted.
2. Register a cultivation record with field location, planting date and crop
   stage where known. Keep this distinct from the recommendation itself.
3. Opt in to SMS notifications using a verified phone number and preferred
   language. Allow later changes and opt-out.
4. Receive relevant alerts when verified weather/bulletin/risk information
   meets the agreed rules for that crop, location and growth stage.
5. Read practical prevention, inspection or management advice.
6. Optionally request agricultural technical officer support.
7. Receive assignment/appointment updates after an available officer accepts.
8. Record follow-up observations and case resolution where appropriate.

Proposed alert categories:
- Heavy rainfall, flooding or waterlogging risks.
- Dry conditions, drought or heat-related crop stress.
- Strong winds or other relevant severe-weather hazards.
- Crop-specific pest and disease advisories.
- Preventive field inspection and crop-management reminders.

Alert sources and evidence:
- Use an appropriate forecast/warning service for future weather risks.
- Use relevant agricultural bulletins and verified observations for pest
  advisories; weather alone does not confirm an infestation.
- Separate official warnings, rule-based risk estimates and farmer reports.
- Include the source, issue time, applicable area and validity period.
- The existing XGBoost classifier does not predict disasters, pests or disease.
- Any new risk model must be trained and validated separately. Initial rules
  require documented sources and review by a qualified agricultural officer.

Treatment and cultivation guidance:
- Provide crop-specific inspection, prevention and management steps.
- Prioritize approved integrated pest-management guidance where applicable.
- Chemical/product advice must come from reviewed, current local guidance
  and relevant product labels, not from crop scores or generated guesses.
- Include necessary restrictions, application precautions and harvest-related
  guidance when recommending a treatment.
- Do not send an unverified pesticide name or dose automatically.
- Where the cause of damage is uncertain, request officer assessment.

Optional officer assistance:
- Let the farmer explicitly request support; do not assign an officer merely
  because a crop was recommended or an alert was sent.
- Match requests by service area, expertise and availability.
- Confirm participation/access arrangements with the relevant officers or
  institution before promising a service.
- Track requested, pending, accepted/assigned, in-progress and closed states.
- Show a pending state when no officer is available.
- Share only necessary farmer/contact/field information with consent.
- Do not claim affiliation with an agricultural authority until established.

Proposed implementation areas:
- Farmer identity and phone verification.
- Cultivation registration and crop-stage updates.
- Consent and notification preferences.
- Forecast/bulletin ingestion and a scheduled risk-evaluation worker.
- Reviewed advisory content and language templates.
- SMS-provider integration and delivery-status callbacks.
- Duplicate-alert suppression, bounded retries and expiry handling.
- Officer profiles, support requests and assignment management.
- Role-based access and audit records.

Suggested future code organization (not existing files):
backend/app/features/crop_finder/cultivation/
backend/app/features/crop_finder/alerts/
backend/app/features/crop_finder/officer_support/
frontend/src/features/crop-finder/pages/MyCultivations.jsx
frontend/src/features/crop-finder/pages/Alerts.jsx
frontend/src/features/crop-finder/pages/OfficerSupport.jsx

Suggested future MongoDB collections (not confirmed as created):
- cultivations
- notification_preferences
- crop_advisories
- alert_events
- sms_deliveries
- officer_profiles
- officer_support_requests

Keep SMS provider credentials on the backend. Select a provider and document
its actual configuration variables before adding them to the setup process.
Test Sinhala/Tamil SMS rendering, message segmentation and delivery costs.
A delivery acknowledgement does not prove that a farmer read the message.

Future validation:
- Relevance of alerts to crop, stage, location and time.
- Risk-rule/model performance against independent recorded events.
- False alarms, missed events and warning lead time.
- Expert correctness of treatment/cultivation guidance.
- SMS delivery latency, duplicates, failures and opt-out handling.
- Officer acceptance time and support-request completion.
- User comprehension across all three languages.

15. DATASET AND MODEL VALIDATION STATUS
========================================
The supplied dataset was programmatically generated for prototype work.
The generation workflow creates 1,000 examples for each of Tea, Rubber,
Pepper, Cocoa and Vanilla.

Do not describe these records as actual IoT observations or as data obtained
from an agricultural authority without evidence. Document and validate the
crop ranges and label-generation assumptions.

The notebook uses an 80/20 split with random_state=42. Preserve the exact
dataset and split associated with the model. Review notebook execution order:
regenerating the CSV after training breaks provenance unless tracked.

No measured accuracy percentage is claimed in this README.
Synthetic-data performance does not establish field accuracy.

Evaluation should include accuracy, macro precision/recall/F1, per-class
metrics, a confusion matrix and top-3 accuracy where appropriate. Prevent
training/test leakage and retain reproducible evaluation records.

SHAP is assessed for explanation correctness/consistency, not as a separate
classifier. Recommendation, hazard detection and SMS delivery require
separate evaluation; there is no single meaningful accuracy for all of them.

16. CHECKS AND DEMONSTRATION
============================
Frontend:
npm.cmd run lint
npm.cmd run build

Backend:
.\.venv\Scripts\python.exe -m pip check

If the repository retains its unittest-based suite:
.\.venv\Scripts\python.exe -m unittest discover -s tests -v

Confirm that tests were discovered and executed. Zero tests is not coverage.

Manual demonstration:
1. Start both servers and open Crop Finder.
2. Load an example or enter valid inputs.
3. Submit a manual analysis and inspect crops and explanations.
4. Test live mode and confirm the actual returned temperature/humidity.
5. Confirm invalid-input and weather-service errors are understandable.
6. Check all crop photographs and the detail popup.
7. Check languages, themes, mobile layout and keyboard navigation.
8. Export the report and verify language, values and page layout.
9. Verify that sidebars remain above, rather than overlap, the shared footer.

Planned SMS/officer features must not appear in a demo as live services
before their integrations and permissions are in place.

17. REMAINING WORK AND PRIORITIES
================================
Runtime:
- Record compatible package versions and verify shared startup.
- Maintain placeholder environment templates.
- Confirm database indexes, permissions and persistence.

Integration:
- Finalize Soil Health input and Fertilizer Guide output contracts.
- Integrate genuine IoT data when available.
- Record source, time, units and model version for analyses.

Research:
- Verify data sources and agronomic assumptions.
- Evaluate against representative independent field data.
- Compare XGBoost with a Random Forest baseline.
- Use spatial block cross-validation when genuine location groups exist.
- Evaluate weather time scales and model sensitivity.
- Assess calibration before interpreting probabilities as confidence.

User experience:
- Verify complete translations, PDF output and dark-theme contrast.
- Clearly distinguish measured, estimated, example and stale inputs.
- Improve empty, loading and failure states.

Post-planting support:
- Implement cultivation registration and SMS consent first.
- Establish advisory sources and officer review/participation arrangements.
- Add risk alerts, multilingual SMS and optional officer requests.
- Pilot the workflow and evaluate it separately from crop prediction.

Seasonal planting timing and expected yield classes remain planned unless
implementation and validation evidence is available. Do not infer these
outputs from the current crop classifier.

18. SHARED DESIGN AND TEAM WORKFLOW
===================================
Use frontend/src/globals.css for shared colors and typography. Reuse shared
UI components and foreground/background theme tokens. Keep module CSS scoped.
Use the shared i18n instance and header controls rather than independent
language/theme state in each module.

The shared repository contains frontend and backend. Do not nest additional
Git repositories inside feature folders. Coordinate changes to shared routes,
dependencies, schemas, themes and navigation.

Work on crop-recommendation-sasanka, review changes, run relevant checks,
commit related work clearly, push and open a pull request targeting main.
Use a merge commit when team/repository rules require preserving individual
commits. Other members must pull or merge updates into their local branches.

After dependency changes:
Frontend: npm.cmd ci
Backend: .\.venv\Scripts\python.exe -m pip install -r requirements.txt

Track package.json, package-lock.json and requirements.txt.
Exclude .env, .venv/, node_modules/, dist/, __pycache__/, *.pyc and temporary
exports/logs containing private data. Keep useful docs/ content updated.

19. TROUBLESHOOTING
===================
Missing .env.example:
Create .env directly without overwriting existing values.

No module named tensorflow / PIL:
Install the team's compatible TensorFlow / Pillow package in backend/.venv
and update requirements.txt. PIL is imported from the Pillow package.

oneDNN messages:
Informational messages alone do not indicate a crash. Read the final exception.

MongoDB timeout:
Check cluster state, IP access rules, network access and timeout settings.
A successful TCP test does not verify authentication or database permissions.
A successful ping does not prove index creation or application persistence.

ECONNREFUSED 127.0.0.1:8000:
Confirm backend startup completed on port 8000.

Vite server connection lost:
Restart the frontend and keep its terminal running.

Unknown cCropExplanation DOM prop:
Render CropExplanation as a JSX component rather than an HTML attribute.

OpenWeather 401:
Check key validity and account access; configuration presence is insufficient.

Invalid package.json/package-lock.json:
Resolve all merge markers while retaining required dependencies across modules.

Windows Application Control blocks a DLL:
Use an administrator-approved environment; recreating .venv may not fix policy.

20. DEPLOYMENT AND RESEARCH LIMITS
==================================
Vite's development proxy is not included in a static production build.
Configure SPA fallback to index.html and route /api to FastAPI. For separate
origins, use the configuration expected by the current API helper and CORS.
Use HTTPS, hosting secrets and a production server configuration without
--reload. Include required model artifacts.

For future SMS/background jobs, use persistent scheduling/delivery tracking
so restarts and multiple API workers do not produce lost or duplicate alerts.

Crop Finder remains a research prototype. Independent field validation and
appropriate agronomic review are required before treating recommendations
or future advisories as operational farming guidance.
