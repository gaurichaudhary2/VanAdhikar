import csv
import json

# Read existing claims
with open("data/claims.csv", "r") as file:
    rows = list(csv.DictReader(file))

# -----------------------------
# Create deliberate anomalies
# -----------------------------

# Anomaly 1: Severe process delay
rows[46]["processing_days"] = "250"

# Anomaly 2: Large area mismatch
rows[146]["claimed_area"] = "10.0"
rows[146]["recorded_area"] = "4.0"

# Anomaly 3: High spatial overlap
rows[246]["overlap_percentage"] = "95"

# Anomaly 4: Missing documents and land record
rows[346]["documents_complete"] = "0"
rows[346]["land_record_available"] = "0"

# Anomaly 5: Multiple problems together
rows[446]["processing_days"] = "280"
rows[446]["claimed_area"] = "9.5"
rows[446]["recorded_area"] = "4.2"
rows[446]["overlap_percentage"] = "92"
rows[446]["documents_complete"] = "0"
rows[446]["land_record_available"] = "0"
rows[446]["previous_rejections"] = "3"

# -----------------------------
# Save updated CSV
# -----------------------------

with open("data/claims.csv", "w", newline="") as file:

    writer = csv.DictWriter(
        file,
        fieldnames=rows[0].keys()
    )

    writer.writeheader()
    writer.writerows(rows)

# -----------------------------
# Update GeoJSON
# -----------------------------

features = []

for row in rows:

    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                float(row["longitude"]),
                float(row["latitude"])
            ]
        },
        "properties": row
    }

    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open("data/claims.geojson", "w") as file:
    json.dump(geojson, file, indent=2)

print("Anomalies injected successfully!")
print("Updated claims.csv")
print("Updated claims.geojson")