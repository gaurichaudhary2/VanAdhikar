import csv
from sklearn.ensemble import IsolationForest

# Read processed data
with open("data/processed_claims.csv", "r") as file:
    claims = list(csv.DictReader(file))

# Features used by the ML model
features = [
    "processing_days",
    "area_mismatch_percentage",
    "overlap_percentage",
    "previous_rejections",
    "documents_complete",
    "land_record_available"
]

# Prepare data for ML
X = []

for claim in claims:
    X.append([
        float(claim[feature])
        for feature in features
    ])

# Create Isolation Forest model
model = IsolationForest(
    n_estimators=100,
    contamination=0.05,
    random_state=42
)

# Train the model and predict anomalies
predictions = model.fit_predict(X)

# Add anomaly result to each claim
for claim, prediction in zip(claims, predictions):

    if prediction == -1:
        claim["ml_anomaly"] = "YES"
    else:
        claim["ml_anomaly"] = "NO"

# Save results
with open("outputs/anomaly_results.csv", "w", newline="") as file:

    fieldnames = claims[0].keys()

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(claims)

print("Anomaly detection completed!")

anomalies = sum(
    1 for claim in claims
    if claim["ml_anomaly"] == "YES"
)

print("Anomalies detected:", anomalies)
print("Created: outputs/anomaly_results.csv")