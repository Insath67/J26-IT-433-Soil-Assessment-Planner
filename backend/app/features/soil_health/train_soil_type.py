from pathlib import Path
import json
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.dummy import DummyRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

BASE = Path(__file__).resolve().parent
DATA = BASE / 'data' / 'Kegalle_Crop_Dataset.csv'
OUT = BASE / 'models' / 'soil_type_nutrients.joblib'
FEATURE = 'suitable_soil_type'
TARGETS = ['N', 'P', 'K', 'ph']

def main():
    df = pd.read_csv(DATA)
    required = [FEATURE, *TARGETS]
    if any(c not in df.columns for c in required):
        raise ValueError(f'Dataset needs columns: {required}')
    df = df.dropna(subset=required)
    X = df[[FEATURE]]
    y = df[TARGETS]
    xtrain, xtest, ytrain, ytest = train_test_split(X, y, test_size=.2, random_state=42, stratify=X[FEATURE])
    # Categorical soil type only: one-hot + regression tree learns group-wise nutrient averages.
    from sklearn.tree import DecisionTreeRegressor
    model = Pipeline([
        ('encode', ColumnTransformer([('soil', OneHotEncoder(handle_unknown='ignore'), [FEATURE])])),
        ('regressor', DecisionTreeRegressor(max_depth=5, random_state=42))
    ])
    model.fit(xtrain, ytrain)
    pred = model.predict(xtest)
    metrics = {k: round(float(mean_absolute_error(ytest[k], pred[:, i])), 3) for i,k in enumerate(TARGETS)}
    allowed = sorted(df[FEATURE].unique().tolist())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({'model': model, 'allowed_soils': allowed}, OUT)
    print('Model saved:', OUT)
    print('Test MAE by target:', json.dumps(metrics, indent=2))
    print('NOTE: These are soil-category averages inferred from crop-assigned labels, not field measurements.')

if __name__ == '__main__':
    main()
