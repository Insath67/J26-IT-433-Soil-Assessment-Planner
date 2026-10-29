SARU BIMA — CROP FINDER
Climate-Aware and Soil-Integrated Crop Recommendation
Kegalle District, Sri Lanka

Component Owner: Sasanka Karindra Bandara
Student ID: IT23343252
Documentation Updated: 29 October 2026

Repository:
https://github.com/Insath67/J26-IT-433-Soil-Assessment-Planner

Component Branch:
crop-recommendation-sasanka


1. OVERVIEW
===========

Crop Finder is the crop recommendation component of Saru Bima, a
collaborative agricultural research platform.

The component combines soil nutrient values and environmental inputs
to rank candidate crops using a trained XGBoost model. Tree SHAP
explains how individual input values influence each crop's model score.

The interface supports English, Sinhala and Tamil, together with
light and dark themes.

Crop Finder is available through:

Home > Crop Finder

Development URL:
http://localhost:5173/crop-finder

This README documents the Crop Finder component and the shared
application dependencies needed to run it. It does not certify the
implementation or research results of the other components.


2. RESEARCH PROBLEM
==================

Crop selection requires consideration of both soil conditions and
environmental conditions. A recommendation is also more useful when
users can understand why a particular crop was suggested.

This component investigates how soil and weather inputs can be
combined in an explainable recommendation workflow for the Kegalle
research context.

The implementation focuses on:

- Combining soil nutrients, pH and environmental variables.
- Ranking candidate crops rather than displaying only one prediction.
- Explaining individual predictions using Tree SHAP.
- Presenting results through a multilingual farmer-facing interface.
- Preparing interfaces for future integration with field measurements.

Regional accuracy and agronomic suitability must be established
through independent validation with suitable field data.


3. APPLICATION ARCHITECTURE
==========================

The project uses:

- One shared React frontend.
- One shared FastAPI backend.
- Separate feature folders for each research component.
- Shared navigation, language selection, theme settings and styling.

The four application modules are:

- Soil Scan
- Soil Health
- Crop Finder
- Fertilizer Guide

The other modules have progressed beyond the original starter
template. Their exact implementation status is maintained by their
respective owners.

Crop Finder prediction workflow:

1. The user enters inputs or loads an available dataset example.
2. The frontend submits a prediction request.
3. The backend validates and prepares the input values.
4. In live weather mode, the backend obtains temperature and humidity.
5. XGBoost calculates a score for each candidate crop.
6. Tree SHAP calculates feature contributions for each crop.
7. The backend returns ranked crops, explanations and input context.
8. The frontend displays crop cards, photographs and explanation panels.


4. TECHNOLOGY STACK
===================

Frontend:
- React
- Vite
- React Router
- react-i18next / i18next
- Shared CSS design tokens and Tailwind styling
- Shared UI components
- Lucide icons

Backend:
- Python 3.12
- FastAPI
- Uvicorn
- NumPy and pandas
- XGBoost
- SHAP
- Requests
- python-dotenv

Shared database:
- MongoDB Atlas
- PyMongo

Additional shared backend dependencies:
- TensorFlow for Soil Scan
- Pillow for image processing

TensorFlow and Pillow are required by the integrated Soil Scan module,
not by the Crop Finder XGBoost model itself.

Use the team's tested dependency versions. Installing a newer package
does not automatically guarantee compatibility with saved models.


5. IMPORTANT FILES
==================

Paths below are relative to the repository root.

Crop Finder frontend:

frontend/src/features/crop-finder/App.jsx
    Main crop dashboard, input form and prediction interaction.

frontend/src/features/crop-finder/App.css
    Component styling, layout and responsive presentation.

frontend/src/features/crop-finder/CropExplanation.jsx
    User-facing SHAP explanation panel.

frontend/src/features/crop-finder/translations.js
    Crop Finder translation resources, where stored as this file.
    Some revisions may use a translations directory instead.

Crop Finder backend:

backend/app/features/crop_finder/router.py
    Crop Finder API routes.

backend/app/features/crop_finder/service.py
    Input processing, model loading, weather retrieval, prediction
    ranking and SHAP explanation logic.

backend/app/features/crop_finder/models/crop_xgboost_model.json
    Saved, trained XGBoost model.

backend/app/features/crop_finder/models/crop_labels.json
    Crop labels corresponding to the model's class output order.

backend/app/features/crop_finder/models/correct_label_encoder.pkl
    Label encoder artifact from the training workflow.

backend/app/features/crop_finder/data/Kegalle_Crop_Dataset.csv
    Dataset supplied for the prototype.

Shared application files:

frontend/src/App.jsx
    Application page routes.

frontend/src/pages/HomePage.jsx
    Shared homepage.

frontend/src/shared/Navigation.jsx
    Main navigation and shared controls.

frontend/src/shared/Footer.jsx
    Shared application footer.

frontend/src/i18n/index.js
    Shared language configuration and translation namespaces.

frontend/src/globals.css
    Shared colors, typography and theme tokens.

frontend/src/services/api.js
    Shared API helper.

frontend/vite.config.js
    Vite configuration and development API proxy.

backend/app/main.py
    FastAPI entry point and router registration.

backend/app/database.py
    Shared MongoDB connection and database initialization.

backend/requirements.txt
    Backend dependency specification.

docs/
    Supporting documentation, workflow and validation notes.
    Retain useful documents and update them as implementation changes.


6. MODEL AND EXPLAINABILITY
==========================

Prediction model:
XGBoost classifier.

Explanation method:
Tree SHAP.

SHAP is not a second crop classifier. It explains the output of the
loaded XGBoost model.

The saved model is loaded by the backend. It is not retrained for
every user request.

The input feature order is:

N, P, K, temperature, humidity, ph, rainfall

The service constructs an input frame in this order and calls:

model.predict_proba(frame)

Tree SHAP uses the same model and input frame to calculate feature
contributions.

Important interpretation:

- Crop scores are model class probabilities.
- They are not measured crop yields.
- They are not guaranteed field-success percentages.
- They should not be described as calibrated confidence unless
  calibration has been implemented and evaluated.
- SHAP contributions explain the model's decision.
- They do not establish agricultural causation.
- SHAP values in the inspected implementation are expressed in
  raw model-margin units, not percentage-point changes in probability.

Model files and label mappings must be updated together when the
model is retrained.


7. INPUTS AND WEATHER MODES
==========================

Model inputs:

N:
    Nitrogen value.

P:
    Phosphorus value.

K:
    Potassium value.

ph:
    Soil pH.

temperature:
    Temperature in degrees Celsius.

humidity:
    Relative humidity as a percentage.

rainfall:
    Rainfall value matching the dataset's intended time period.

Nutrient units must be documented and consistent between training,
manual inputs, sensors and upstream prediction modules. Do not assume
that values from different measurement methods are interchangeable.

Manual mode:

- Soil and environmental values are supplied in the request.
- Dataset examples can be used for demonstrations.
- An example loaded from a CSV is not a live sensor measurement.

Live weather mode:

- The backend requests weather data from OpenWeather.
- Temperature and humidity are obtained from the weather response.
- Soil inputs remain supplied by the user or an integrated source.
- Rainfall remains a separately supplied value.

The prototype currently treats rainfall as an annual value under
its documented assumption. Confirm that assumption against the
training data before using field measurements.

Do not substitute hourly rainfall for annual rainfall.

Live weather configuration:

OPENWEATHER_API_KEY must be present in backend/.env.

A configured key does not prove that the key is valid or that the
external service is reachable.

Changing weather values does not necessarily change the highest-ranked
crop. Compare the actual model inputs, crop scores and SHAP factors
when evaluating weather sensitivity.

Submit a new analysis after changing inputs. Updating a visible field
alone does not prove that a new prediction has been calculated.


8. OUTPUTS AND USER INTERFACE
============================

Crop Finder provides:

- Ranked crop recommendations.
- A highlighted highest-ranked crop.
- Model scores for candidate crops.
- Crop photographs and a crop-detail popup.
- Per-crop SHAP explanations.
- Positive and negative feature contributions.
- The values used for the analysis.
- Input-range warnings where applicable.
- Weather source information where returned by the API.
- An analysis report/export workflow.

Interface updates include:

- English, Sinhala and Tamil language support.
- Shared light and dark themes.
- Improved input-form positioning and responsive layout.
- Clearer explanation sections and readable factor summaries.
- Crop images associated with recommendation cards.
- PDF report functionality added during frontend updates.

Report verification:

Confirm that the current export action produces the intended PDF
rather than the earlier JSON-only download.

If the implementation uses the browser print dialog, select
"Save as PDF". Check Sinhala and Tamil font rendering, page breaks,
input values and the selected crop before accepting the report.


9. FIRST-TIME SETUP — WINDOWS
============================

Open the repository root in VS Code.

Prerequisites:

- Git
- Node.js and npm compatible with frontend/package.json
- Python 3.12
- Access to the team's MongoDB Atlas project
- An OpenWeather key for live weather mode

Terminal 1 — Frontend:

cd frontend
npm.cmd ci
npm.cmd run dev

Open:
http://localhost:5173

Keep this terminal running.

Using npm.cmd avoids the PowerShell npm.ps1 execution-policy issue.

Terminal 2 — Backend:

Open a separate terminal at the repository root.

cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Create the virtual environment only if it does not already exist.
Do not copy a virtual environment from another computer.

Use the virtual environment's Python executable directly.
Activation is optional.

Before starting the backend, configure backend/.env as described below.


10. ENVIRONMENT CONFIGURATION
=============================

From the backend directory:

if (!(Test-Path .env)) {
    New-Item -Path .env -ItemType File
}
code .env

This preserves an existing .env file.

Set the following variables using your actual private configuration:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB=YOUR_TEAM_DATABASE_NAME
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Do not leave placeholder values in the running configuration.

The shared database code previously used soil_assessment_db as its
default database name. Confirm the intended database with the team.

The .env.example file is optional. If it is absent, create .env
directly; do not repeatedly run a failing Copy-Item command.

Never commit real credentials. A committed .env.example should
contain placeholders only.

MongoDB Atlas requirements:

- The cluster must be available.
- Your current public IP must be allowed in the project's access list.
- The database user must have permissions for the intended operations.
- The connection string must contain valid credentials.

The shared backend initializes MongoDB during application startup.
A failed database connection can prevent all API modules from starting.

A standalone MongoDB ping succeeded during troubleshooting.
Full application startup and read/write permissions must still be
checked separately.

A 20-second server-selection timeout was recommended after the
original 5-second timeout failed. Confirm that the intended setting
is present in backend/app/database.py.


11. START THE BACKEND
====================

From backend:

.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Wait for:

Application startup complete.

The "Uvicorn running" message alone is not sufficient if a later
traceback reports an import or startup failure.

Development ports:

Frontend: 5173
Backend: 8000

Keep both terminals running. Stop a server with Ctrl+C.

For subsequent runs:

Frontend:
cd frontend
npm.cmd run dev

Backend, in a separate terminal:
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Install dependencies again when the dependency files change.

Linux/macOS equivalents:

python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Use npm ci and npm run dev for the frontend.


12. API ROUTES
==============

GET /api/health
    Shared API health endpoint.

GET /api/crop-finder/health
    Crop Finder health and configuration information.

GET /api/crop-finder/metadata
    Input metadata and available example data.

POST /api/crop-finder/predict
    Crop prediction and explanation request.

API documentation:
http://127.0.0.1:8000/docs

Crop Finder health:
http://127.0.0.1:8000/api/crop-finder/health

Example manual prediction body:

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

These are demonstration inputs, not a field observation or a
prescription for crop cultivation.

For live weather mode, set weather_mode to "live". The backend
obtains temperature and humidity while retaining the supplied soil
and rainfall values.

Check the current API schema before changing request or response
field names.


13. HOW TO TRY CROP FINDER
========================

1. Start the backend and wait for successful startup.
2. Start the frontend.
3. Open Home > Crop Finder.
4. Open the new-analysis form.
5. Load an available sample or enter valid inputs.
6. Select manual or live weather mode.
7. Submit the analysis.
8. Review the ranked crop cards.
9. Select a crop to inspect its photograph and SHAP explanation.
10. Change language and confirm that module text updates.
11. Switch between light and dark themes.
12. Generate the analysis report and check its content.


14. INTEGRATION WITH OTHER COMPONENTS
====================================

Soil Scan:

- Intended to supply soil classification information.
- The current seven-feature XGBoost model does not directly accept
  soil type as a model feature.
- Passing soil type through the UI does not make the model use it.
- Direct model use requires an updated training pipeline, encoding,
  saved model and API contract.

Soil Health:

- Intended to supply measured or estimated soil values.
- Agree on field names, units, timestamps and sample identifiers.
- Distinguish measured values from estimated values.
- Avoid silently substituting missing values with demonstration data.

Fertilizer Guide:

- Intended to receive the selected crop and relevant soil context.
- Agree with the component owner on the handoff API or shared record.
- Include the sample identifier, selected crop, nutrient values,
  pH, units, timestamp and data source where available.
- Do not present SHAP contributions as fertilizer dosages.

Real-time IoT:

- End-to-end real sensor integration remains pending confirmation.
- Validate freshness, units, device identity and missing readings.
- Do not label CSV examples or manually entered values as live IoT data.

Database:

- MongoDB support has been introduced in the shared backend.
- This does not automatically mean Crop Finder predictions are saved.
- Verify recommendation persistence, retrieval and sample linking
  before documenting those features as complete.


15. DATASET AND RESEARCH STATUS
==============================

The supplied Crop Finder dataset was programmatically generated
for prototype development.

It contains five crop classes:

- Tea
- Rubber
- Pepper
- Cocoa
- Vanilla

The generation workflow creates 1,000 examples per crop.

This dataset must not be described as real IoT measurements or as
records obtained from an agricultural authority without supporting
evidence.

Crop ranges and labels require documented agronomic justification.
A district name in the dataset filename is not proof of regional
representativeness.

The training notebook uses an 80/20 split with random_state=42.
Confirm that evaluation uses the exact dataset and split associated
with the saved model.

The notebook's data-generation and training cell order must be
reviewed before rerunning it. Regenerating the CSV after training
can break the link between the saved model and its training data.

No accuracy percentage is claimed in this README.


16. VALIDATION CHECKLIST
=======================

Software checks:

From frontend:

npm.cmd run lint
npm.cmd run build

From backend:

.\.venv\Scripts\python.exe -m pip check

Where the repository includes the unittest-based test suite:

.\.venv\Scripts\python.exe -m unittest discover -s tests -v

Confirm that tests were discovered and actually executed.
A command completing with zero tests does not demonstrate coverage.

Functional checks:

- Valid manual input returns recommendations.
- Missing or invalid inputs return understandable errors.
- Live weather failures are handled clearly.
- Returned model inputs match the intended input source.
- Crop names correspond to the correct probability columns.
- SHAP factors correspond to the selected crop.
- Images load for all supported crops.
- Translations work across inputs, results, errors and reports.
- Dark-mode text remains readable.
- The sidebar does not overlap the shared footer.
- Reports contain the actual analysis values.

Model evaluation:

- Accuracy
- Macro precision
- Macro recall
- Macro F1-score
- Per-class metrics
- Confusion matrix
- Top-3 accuracy where useful

Prevent training/test leakage and retain reproducible split records.
Do not evaluate a saved model on data already used for training and
report that result as independent test performance.

Synthetic-data performance does not establish field accuracy.

SHAP should be assessed for explanation consistency and correctness;
it is not evaluated as a separate crop classifier.


17. REMAINING WORK AND RECOMMENDED UPDATES
========================================

Priority 1 — Reproducible runtime:
- Record tested package versions for all shared modules.
- Include TensorFlow and Pillow in the shared requirements.
- Verify full backend startup and MongoDB permissions.
- Maintain a placeholder-only .env.example.

Priority 2 — Data and integration:
- Finalize the Soil Health to Crop Finder input contract.
- Connect real IoT readings when the device integration is ready.
- Implement the agreed Fertilizer Guide handoff.
- Confirm whether Crop Finder analysis history is persisted.
- Record source, timestamp, units and model version per analysis.

Priority 3 — Research validation:
- Verify crop-range references and dataset provenance.
- Validate on independent, representative field observations.
- Compare XGBoost with a Random Forest baseline.
- Implement spatial block cross-validation only when genuine
  location/group information is available.
- Evaluate weather sensitivity using appropriate time windows.
- Assess probability calibration before using confidence language.

Priority 4 — User experience:
- Verify complete translations and localized PDF output.
- Display input freshness and whether values are measured or estimated.
- Improve loading, empty and external-service failure states.
- Test keyboard navigation and mobile layouts.

Random Forest comparison, spatial block cross-validation, seasonal
planting timing and expected yield classes must remain planned items
unless their implementation and evaluation are available.

Adding these items to this README does not implement them.


18. TEAM WORKFLOW
================

The shared repository contains both frontend and backend directories.
Do not create nested Git repositories inside feature folders.

Work on the component branch:

crop-recommendation-sasanka

Before committing:

- Review the changed files.
- Run relevant checks.
- Confirm that secrets and generated environment folders are excluded.
- Coordinate changes to shared routes, dependencies and design tokens.

Commit related changes with clear messages and push the branch.
Create a pull request targeting main.

When the team needs to preserve individual commits in main history,
use a merge commit if repository rules permit it.

Other members must pull or merge the updated main branch to receive
the changes locally.

After dependency changes, members should run:

Frontend:
npm.cmd ci

Backend:
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Exclude these from Git:

- .env and other private environment files
- .venv/
- node_modules/
- dist/
- __pycache__/
- *.pyc
- Local logs and temporary exports

Keep requirements.txt, package.json and package-lock.json tracked.


19. TROUBLESHOOTING
===================

Missing .env.example:
    Create backend/.env directly. Do not overwrite existing credentials.

No module named tensorflow:
    Install the team's tested TensorFlow version in backend/.venv
    and add it to requirements.txt.

No module named PIL:
    Install Pillow in backend/.venv and add it to requirements.txt.

oneDNN informational messages:
    These messages alone do not indicate application startup failure.
    Read the final exception in the traceback.

MongoDB ServerSelectionTimeoutError:
    Check cluster availability, IP access rules, network access,
    connection settings and the configured timeout.

MongoDB ping succeeds but startup fails:
    Read the new traceback. Check database permissions, index creation
    and whether the application loads the same environment values.

ECONNREFUSED 127.0.0.1:8000:
    The Vite proxy cannot reach the backend. Confirm successful
    application startup on port 8000.

Vite server connection lost:
    Restart the frontend development server and keep its terminal open.

Unknown cCropExplanation DOM prop:
    Check JSX placement. CropExplanation must be rendered as a
    component, not attached as an attribute to an HTML element.

OpenWeather HTTP 401:
    Check the API key and account configuration. The presence of a
    key in .env does not prove that the provider accepts it.

Invalid package.json or package-lock.json:
    Check for unresolved merge markers. Preserve dependencies required
    by all modules when resolving conflicts.

Windows Application Control blocks a DLL:
    Use an administrator-approved Python and package configuration.
    Recreating a virtual environment does not guarantee resolution.


20. DEPLOYMENT NOTES
===================

Vite's development proxy is not part of the static production build.

For deployment:

- Build the frontend.
- Configure SPA fallback to index.html.
- Route /api requests to the FastAPI service.
- Configure the actual frontend origin in backend CORS settings.
- Store credentials in the hosting platform's secret configuration.
- Use HTTPS.
- Do not use Uvicorn's --reload option in production.
- Confirm model files are included in the backend deployment.

If using separate frontend and backend origins, check the environment
variable expected by the current API helper before configuring it.


21. RESEARCH USE
===============

Saru Bima Crop Finder is a research prototype.

Recommendations and explanations should be interpreted within the
limitations of the training data, input quality and validation.

Independent field validation and appropriate agronomic review are
required before treating its output as operational farming advice.
