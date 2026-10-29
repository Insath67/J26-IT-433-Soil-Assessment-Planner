SARU BIMA
Image Processing and Machine Learning-Based Soil Assessment
and Crop Recommendation — Sri Lanka

Research Focus: Kegalle District
Documentation Updated: 29 October 2026

Repository:
https://github.com/Insath67/J26-IT-433-Soil-Assessment-Planner

1. PROJECT OVERVIEW
===================
Saru Bima is a collaborative agricultural research platform that brings
soil classification, soil health assessment, crop recommendation and
fertilizer guidance into one web application.

The platform is designed to help users understand their soil, explore
crop options and interpret the factors behind agricultural recommendations.
It supports a shared English, Sinhala and Tamil interface and light/dark
presentation themes.

The project uses one React frontend and one FastAPI backend. Each research
component has its own frontend and backend feature folders. Navigation,
language settings, themes, API infrastructure and database configuration
are shared.

This README covers the entire project. Component-specific documentation
should remain in the corresponding feature folders.

Documentation is based on the code and development updates shared by the
team, not an independent audit of the latest repository. Proposed features
are explicitly identified. Successful startup is not proof of research
accuracy, completed integration or production readiness.

2. RESEARCH COMPONENTS
======================

SOIL SCAN
Route: /soil-scan
Frontend: frontend/src/features/soil-scan/
Backend: backend/app/features/soil_scan/

Purpose:
Classify soil from images and provide soil-type context for the wider system.

Known integration:
The shared backend imports a Soil Scan prediction service using TensorFlow
and Pillow. These dependencies must be available for shared startup.

To verify with the component owner:
- Saved image-classification model and label mapping.
- Supported image formats, preprocessing and input validation.
- Actual classification accuracy and held-out test results.
- How soil-type results are transferred to other components.

SOIL HEALTH
Route: /soil-health
Frontend: frontend/src/features/soil-health/
Backend: backend/app/features/soil_health/

Purpose:
Assess soil nutrients and fertility using available soil inputs and support
future ingestion of genuine IoT measurements.

Development shared to date includes:
- New analysis and analysis-result pages.
- Soil history and device-status pages.
- Nutrient-status and fertility assessment logic.
- Additional ML/soil-type prediction services.
- MongoDB soil-sample storage code.
- Report generation and multilingual/theme updates.

To verify:
- Which screens use browser storage versus backend MongoDB records.
- Which outputs are rule-based and which come from trained models.
- Measurement units, agronomic thresholds and validation evidence.
- Whether device status is derived from a real device heartbeat.
- Complete translations and report rendering across all module pages.

Do not label demonstration readings or an environment-flag status as verified
live IoT telemetry. Some previously shared recommendations and display values
were fixed examples; confirm or replace them before presenting live results.

CROP FINDER
Route: /crop-finder
Frontend: frontend/src/features/crop-finder/
Backend: backend/app/features/crop_finder/
Owner: Sasanka Karindra Bandara — IT23343252

Purpose:
Combine soil and environmental inputs to rank candidate crops and explain
the predictions with Tree SHAP.

Development shared to date includes:
- Manual inputs and available dataset examples.
- Saved XGBoost model and crop-label mapping.
- Ranked crop scores and per-crop SHAP explanations.
- OpenWeather temperature/humidity integration.
- Crop photographs, detail popup and explanation-panel improvements.
- Multilingual interface, theme support and report-export updates.

Current model features, in order:
N, P, K, temperature, humidity, ph, rainfall

The current seven-feature model does not directly use soil type or EC.
Including those inputs requires coordinated training, API and model changes.

SHAP explains the XGBoost model; it is not a second crop classifier.
Class probabilities are not guaranteed crop-success or yield percentages.
The inspected implementation uses SHAP contributions in raw model-margin
units, not percentage-point changes in probability.

FERTILIZER GUIDE
Route: /fertilizer-guide
Frontend: frontend/src/features/fertilizer-guide/
Backend: backend/app/features/fertilizer_guide/

Purpose:
Provide fertilizer guidance using crop and soil information.

Its route and feature folders form part of the shared application. The latest
algorithm, model, nutrient rules, dosage calculations and validation status
must be documented by its owner. This README does not declare them complete.

A proposed integration will pass the selected crop and soil/sample context
from Crop Finder. SHAP contributions must not be converted directly into
fertilizer dosages.

3. SYSTEM WORKFLOW AND INTEGRATION BOUNDARIES
============================================
Intended end-to-end workflow:
1. Collect an image, manual soil data or verified sensor measurements.
2. Obtain soil classification and nutrient/fertility assessment.
3. Prepare consistent soil and weather inputs for Crop Finder.
4. Generate crop rankings and explain the individual recommendations.
5. Let the user select a crop and request relevant fertilizer guidance.
6. Store associated sample/analysis records where persistence is implemented.
7. In a future extension, register actual cultivation and opt in to alerts.

These stages are the intended integrated workflow. Their presence in separate
modules does not prove that every handoff is automated today.

Agree on a shared data contract containing:
- Sample and field identifiers.
- Crop identifier and model/label version.
- Location, observation time and data source.
- Numeric values and explicit units.
- Measured versus predicted/estimated status.
- Missing-value and quality indicators.
- Soil-type labels and supported categories.

Keep machine-readable keys stable across languages. Translate display text,
not stored identifiers or model class mappings. Never silently fill missing
field data with example values.

4. REPOSITORY ORGANIZATION
==========================
The repository root contains frontend/, backend/ and supporting docs/.
There are not four independent React projects or four virtual environments.

Frontend feature folders:
frontend/src/features/soil-scan/
frontend/src/features/soil-health/
frontend/src/features/crop-finder/
frontend/src/features/fertilizer-guide/

Backend feature folders:
backend/app/features/soil_scan/
backend/app/features/soil_health/
backend/app/features/crop_finder/
backend/app/features/fertilizer_guide/

Shared frontend files:
frontend/src/App.jsx                  Application routes
frontend/src/main.jsx                 Frontend initialization
frontend/src/pages/HomePage.jsx       Homepage
frontend/src/shared/Navigation.jsx    Navigation and header controls
frontend/src/shared/Footer.jsx        Shared footer
frontend/src/shared/modules.js        Module navigation metadata
frontend/src/shared/workspace.css     Shared layout styles
frontend/src/globals.css              Theme tokens and typography
frontend/src/components/ui/           Shared UI components
frontend/src/i18n/index.js             Shared language configuration
frontend/src/i18n/locales/            Shared translations
frontend/src/services/api.js          Shared request helper
frontend/vite.config.js               Vite and API-proxy configuration
frontend/package.json                 Frontend scripts/dependencies
frontend/package-lock.json            Frontend dependency lock file

Shared backend files:
backend/app/main.py                   FastAPI entry point and routers
backend/app/database.py               MongoDB connection/initialization
backend/app/shared/                   Shared infrastructure
backend/tests/                       Existing backend tests
backend/requirements.txt              Backend dependencies
backend/.env                         Private local configuration

Useful Crop Finder artifacts:
backend/app/features/crop_finder/models/crop_xgboost_model.json
backend/app/features/crop_finder/models/crop_labels.json
backend/app/features/crop_finder/models/correct_label_encoder.pkl
backend/app/features/crop_finder/data/Kegalle_Crop_Dataset.csv

Preserve docs/ for team workflow, design decisions, data provenance and
validation evidence. Do not delete useful documentation merely to simplify
the folder view. Feature-specific README files should identify their owner,
inputs, outputs, dependencies, model artifacts, tests and remaining work.

5. TECHNOLOGY STACK
===================
Frontend:
React, Vite, React Router, i18next/react-i18next, shared CSS/Tailwind styling,
shared UI components and Lucide icons.

Backend:
Python 3.12, FastAPI and Uvicorn.

Data and machine learning:
NumPy, pandas, scikit-learn/joblib where used, XGBoost and SHAP.
TensorFlow and Pillow are required by the integrated Soil Scan service.

Storage and external services:
MongoDB Atlas/PyMongo, python-dotenv and OpenWeather/Requests.
SMS and officer-assignment services are planned, not current dependencies.

Use package versions tested with the team's models. A newer package is not
necessarily compatible with an existing saved model. All shared dependencies
must be recorded in the appropriate package/requirements files.

6. FIRST-TIME SETUP — WINDOWS
=============================
Prerequisites:
- Git and access to the repository.
- Node.js/npm compatible with frontend/package.json.
- Python 3.12.
- MongoDB Atlas project/database access.
- An OpenWeather key if live weather is required.

Clone the repository if it is not already on your computer:

git clone https://github.com/Insath67/J26-IT-433-Soil-Assessment-Planner.git
cd J26-IT-433-Soil-Assessment-Planner

If already cloned, open the existing repository root in VS Code.
Do not clone another repository inside a feature folder.

Terminal 1 — Frontend:

cd frontend
npm.cmd ci
npm.cmd run dev

Open http://localhost:5173 and keep the terminal running.
npm.cmd avoids the PowerShell npm.ps1 execution-policy issue.

Terminal 2 — Backend, starting from the repository root:

cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Create the virtual environment only when it does not already exist.
Do not copy a virtual environment from another PC. Activation is optional
when commands use the virtual environment's Python executable directly.

Complete environment configuration before starting the backend.

7. ENVIRONMENT CONFIGURATION
=============================
From backend, create/open .env without overwriting an existing file:

if (!(Test-Path .env)) {
    New-Item -Path .env -ItemType File
}
code .env

Set your actual private values:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB=YOUR_TEAM_DATABASE_NAME
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Replace placeholders. Confirm the database name with the team. Earlier
shared code used soil_assessment_db when MONGODB_DB was not set.

An absent .env.example does not prevent setup: create .env directly.
A tracked .env.example should contain placeholders only. Never commit or
publish real database passwords, API keys or SMS credentials.

MongoDB setup requirements:
- The intended cluster must be available.
- The current public IP must be permitted in the Atlas access list.
- Database-user credentials must be valid.
- The user must have permissions for the application's operations.

The shared backend initializes MongoDB at startup. A failure may prevent
all module APIs from starting, even if only one module uses the collection.

A standalone MongoDB ping succeeded during earlier troubleshooting. Full
startup, index creation and data read/write access still require verification.
A 20-second server-selection timeout was recommended after a 5-second timeout;
confirm the intended configuration in app/database.py.

8. STARTUP AND EVERYDAY USE
===========================
From backend:

.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Wait for:
Application startup complete.

A Uvicorn running message followed by a traceback is not a successful startup.
Keep both frontend and backend terminals open. Stop a server with Ctrl+C.

Existing development ports:
Frontend: 5173
Backend: 8000

Useful addresses:
Homepage:          http://localhost:5173/
Soil Scan:         http://localhost:5173/soil-scan
Soil Health:       http://localhost:5173/soil-health
Crop Finder:       http://localhost:5173/crop-finder
Fertilizer Guide:  http://localhost:5173/fertilizer-guide
API documentation: http://127.0.0.1:8000/docs
Shared API health: http://127.0.0.1:8000/api/health

For subsequent runs, use npm.cmd run dev from frontend and the Uvicorn command
from backend. Reinstall dependencies when dependency files change.

Linux/macOS equivalents:
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Use npm ci and npm run dev in frontend.

9. API ORGANIZATION
====================
backend/app/main.py registers feature routers under /api.
The running /docs page is the authoritative list for the checked-out code.

Known shared endpoint:
GET /api/health

Known Crop Finder endpoints:
GET  /api/crop-finder/health
GET  /api/crop-finder/metadata
POST /api/crop-finder/predict

Known Soil Health endpoints in the shared router:
GET  /api/soil-health/status
GET  /api/soil-health/samples
POST /api/soil-health/samples
GET  /api/soil-health/samples/latest
GET  /api/soil-health/samples/{sample_id}
GET  /api/soil-health/analysis/{sample_id}
POST /api/soil-health/analysis/{sample_id}
GET  /api/soil-health/device/status
GET  /api/soil-health/sensors/latest

Some revisions also expose /soil aliases and additional ML endpoints.
Check /docs before integrating. Obtain current Soil Scan and Fertilizer Guide
endpoint contracts from their owners; do not guess prediction route names.

Example Crop Finder manual request:
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

These are example inputs, not a field observation or an agronomic prescription.

10. WEATHER, DATA SOURCES AND STORAGE
=====================================
Crop Finder manual mode uses supplied soil and environmental values.
Live mode obtains temperature and humidity from OpenWeather; rainfall remains
a separately supplied value. A configured key does not prove service access.

The prototype uses an annual-rainfall assumption. Confirm the dataset's time
basis before using field data. Hourly rainfall, annual rainfall and climatic
averages are not interchangeable. Current weather is not a future forecast.

The supplied Crop Finder dataset was programmatically generated for prototype
work. Its generation workflow creates 1,000 examples each for Tea, Rubber,
Pepper, Cocoa and Vanilla. This must not be presented as measured IoT data or
as records obtained from an authority without supporting evidence.

Document provenance independently for each module's dataset. Do not assume
all four modules have the same data source or validation status.

The shared MongoDB code uses a soil_samples collection and creates indexes
for sampleId and timestamp. Audit frontend history/storage helpers as well:
browser localStorage is local to the browser and is not a shared database.

MongoDB connectivity alone does not prove that all analysis types, reports,
images or crop recommendations are persisted. Each owner must document the
implemented write/read workflow and retention requirements.

11. SHARED LANGUAGES, THEMES AND DESIGN
======================================
Supported interface languages:
English, Sinhala and Tamil.

Use the shared i18n instance initialized in frontend/src/i18n/index.js.
Place common labels in shared locale files and component-specific labels in
module translation resources. Use translation keys in pages, forms, validation,
buttons, status messages, popups and reports rather than hardcoded text.

Keep the same language selection across modules. Unknown user-entered names
or external records are not automatically translated by interface resources.

The shared theme control applies the selected light/dark theme at the document
root. Reuse it instead of creating separate unsynchronized module toggles.
Use shared color and foreground tokens from frontend/src/globals.css.

Coordinate edits to Navigation, Footer, App routes and shared design tokens.
Scope component CSS to prevent styles leaking into other modules. Ensure
sidebars remain within their module layout and do not overlap the shared footer.

Verify Sinhala/Tamil fonts, long text wrapping, keyboard access, mobile views
and contrast in both themes. Verify PDF output separately from on-screen text.

12. PLANNED CROP ALERTS AND OPTIONAL OFFICER SUPPORT
===================================================
Status: Proposed extension owned by the Crop Finder component; not yet
implemented or validated as an operational service.

Purpose:
Support farmers who choose to cultivate a recommended crop with relevant
SMS warnings, reviewed cultivation/treatment advice and optional access to
an agricultural technical officer.

Proposed workflow:
1. Register the crop actually planted, field location and planting date/stage.
2. Obtain explicit SMS consent and verify the farmer's phone number.
3. Store the preferred language and notification preferences.
4. Evaluate applicable forecasts, official bulletins and verified observations.
5. Send relevant crop/location/stage-specific alerts with source and validity.
6. Offer an optional request for agricultural technical officer assistance.
7. Assign an available participating officer after acceptance and notify the
   farmer; keep requests pending when no officer is available.
8. Record follow-up and resolution with appropriate access controls.

Possible alerts include heavy rainfall, flooding/waterlogging, dry conditions,
heat, wind damage and crop-specific pest or disease advisories.

The existing crop classifier does not predict disasters or pest outbreaks.
A separate, documented risk/advisory process is required. Weather alone does
not confirm an infestation. Distinguish official warnings, estimated risks
and farmer-reported damage.

Cultivation and treatment guidance should use current reviewed agricultural
sources. Product/dosage guidance must be checked against applicable local
recommendations and product labels by a qualified reviewer. Do not generate
unverified chemical dosages from crop scores or SHAP values.

Officer support is optional. Obtain farmer consent before sharing contact or
field details. Establish officer participation and institutional arrangements
before promising assignments or claiming an official partnership.

Implementation work includes cultivation records, consent/opt-out, reviewed
multilingual advisory content, a scheduled worker, SMS delivery tracking,
duplicate suppression, expiry/retry rules, officer roles and case management.

Evaluate risk accuracy, false/missed alerts, lead time, advice correctness,
SMS delivery latency, language comprehension and officer response times.
A delivered SMS does not prove that the user read it.

13. VALIDATION AND RESEARCH EVIDENCE
===================================
Frontend, from frontend:
npm.cmd run lint
npm.cmd run build

Backend, from backend:
.\.venv\Scripts\python.exe -m pip check

If the repository retains its unittest-based suite:
.\.venv\Scripts\python.exe -m unittest discover -s tests -v

Confirm tests were discovered and executed. Zero discovered tests is not
successful coverage. Run checks relevant to changes in shared functionality.

End-to-end checks:
- Backend completes startup and required model artifacts load.
- Every navigation route opens and direct route loading works.
- Invalid/missing input produces understandable errors.
- Results correspond to the submitted sample and values.
- Database records can be created and retrieved where implemented.
- Upstream/downstream identifiers and units remain consistent.
- External-service failures are handled clearly.
- Languages, themes, images, popups and reports work across modules.
- No demonstration value is incorrectly labeled as measured live data.

Model evaluation:
Each component owner must provide dataset provenance, split strategy,
preprocessing, metrics and limitations appropriate to the model/task.
For classifiers, report per-class performance and a confusion matrix in
addition to accuracy and macro precision/recall/F1. For numeric predictions,
use appropriate regression metrics and report units.

Avoid training/test leakage. Keep original test partitions and model/data
versions. Synthetic-data performance does not establish real field accuracy.
For Crop Finder, evaluate top-3 performance where useful and compare a Random
Forest baseline. Spatial block validation requires genuine location groups.
SHAP is an explanation method, not another classifier accuracy result.

No project-wide accuracy percentage or completed field validation is claimed
by this README. Prediction quality, interface behavior and delivery reliability
must be evaluated separately.

14. REMAINING PROJECT WORK
==========================
- Confirm complete startup and compatible dependency versions for all modules.
- Finalize shared sample IDs, units, soil labels and handoff schemas.
- Connect real IoT ingestion and trustworthy device heartbeat reporting.
- Verify Soil Scan classification transfer and Soil Health input provenance.
- Complete/verify Crop Finder to Fertilizer Guide integration.
- Reconcile browser history with shared database persistence.
- Verify translations, reports, responsive layout and theme coverage.
- Document sources for thresholds, generated labels and recommendation rules.
- Validate models on representative independent data.
- Evaluate seasonal timing/yield-class features before claiming implementation.
- Implement and pilot the planned SMS/officer workflow separately.
- Add identity, role-based permissions and privacy controls before introducing
  real farmer contact records and officer assignments.

This list is a development roadmap, not a statement that every listed item
has already been implemented.

15. TEAM COLLABORATION AND GIT
==============================
Use the shared repository and each member's assigned branch. Confirm branch
names with the team. The known Crop Finder branch is:
crop-recommendation-sasanka

Each member primarily owns their feature folders. Coordinate edits to:
- Application routes and shared API contracts.
- Main backend router registration and database configuration.
- Dependency manifests and lock files.
- Shared styles, translations, navigation and footer.

Before updating a branch, commit or safely preserve unfinished local work.
Fetch main, review incoming changes and resolve conflicts deliberately.
Do not blindly accept one side of a conflict in shared dependency files.

Commit related changes with clear messages, push the feature branch and open
a pull request to main. Use required review/check gates. Use a merge commit
when preserving individual commits is the team's agreed workflow and allowed
by repository rules. Do not rewrite shared history to fabricate progress.

After a merge, other members must pull or merge the updated main into their
own local workflow; pushing does not automatically change their computers.

After dependency updates:
Frontend: npm.cmd ci
Backend: .\.venv\Scripts\python.exe -m pip install -r requirements.txt

Track package.json, package-lock.json, requirements.txt, code and useful docs.
Exclude .env/private settings, .venv/, node_modules/, dist/, __pycache__/, *.pyc,
local logs and private temporary reports. Keep placeholders in .env.example.

16. TROUBLESHOOTING
===================
Blank frontend:
Read the browser console and Vite terminal. Check imports, JSX and JSON for
errors or unresolved merge markers. Run commands from frontend.

Vite connection lost:
Restart npm.cmd run dev and keep the terminal open.

ECONNREFUSED 127.0.0.1:8000:
The proxy cannot reach FastAPI. Confirm backend startup completed on 8000.

Python executable not found:
Create .venv inside backend and run its executable from that directory.

No module named tensorflow:
Install the team's tested TensorFlow version in backend/.venv and record it
in requirements.txt.

No module named PIL:
Install Pillow, the package providing PIL, and record it in requirements.txt.

oneDNN informational messages:
These alone do not indicate failure. Read the final traceback exception.

MongoDB timeout:
Check cluster state, public-IP access, network reachability and configuration.
TCP success does not prove authentication; ping success does not prove every
application operation is permitted. Inspect any subsequent startup error.

Missing .env.example:
Create .env directly without overwriting existing values.

OpenWeather 401:
Check the actual key and account access. A populated variable is insufficient.

Unknown cCropExplanation DOM prop:
Render CropExplanation as a JSX component, not an HTML attribute.

Sidebar overlaps footer or dark-mode text disappears:
Review component-scoped layout rules and foreground/background theme tokens.

Application Control blocks a DLL:
Use an administrator-approved Python/package environment. A new virtual
environment does not necessarily resolve a Windows security policy block.

Port in use:
Identify and stop the older project server before restarting. Keep the
frontend/backend ports and proxy target consistent.

17. DEPLOYMENT AND RESPONSIBLE USE
==================================
Vite's development proxy is not included in static hosting. Build the frontend,
configure SPA fallback to index.html and route /api to the backend. For separate
origins, follow the actual API helper's configuration and backend CORS settings.

Use HTTPS, platform secret storage, appropriate logging and required model
artifacts. Do not run production Uvicorn with --reload. Plan database backups
and access controls. Do not put secret API keys into frontend build variables.

Future SMS jobs need persistent scheduling/delivery records so restarts or
multiple API workers do not lose or duplicate alerts. Test costs, Unicode
message segmentation, consent and opt-out before real farmer deployment.

Saru Bima is a research prototype. Recommendations depend on input quality,
data provenance and validation. Independent field validation and qualified
agronomic review are needed before treating outputs as operational farming
advice. The availability of an API, a model score or a polished dashboard is
not evidence of completed scientific validation.
