import csv

# Read the claims dataset
with open("data/claims.csv", "r") as file:
    claims = list(csv.DictReader(file))

# Calculate area mismatch percentage
for claim in claims:
    claimed = float(claim["claimed_area"])
    recorded = float(claim["recorded_area"])

    if claimed > 0:
        mismatch = abs(claimed - recorded) / claimed * 100
    else:
        mismatch = 0

    claim["area_mismatch_percentage"] = round(mismatch, 2)

# Convert numerical values to numbers
numeric_columns = [
    "claimed_area",
    "recorded_area",
    "processing_days",
    "documents_complete",
    "land_record_available",
    "overlap_percentage",
    "previous_rejections",
    "latitude",
    "longitude",
    "area_mismatch_percentage"
]

for claim in claims:
    for column in numeric_columns:
        claim[column] = float(claim[column])

# Save processed data
with open("data/processed_claims.csv", "w", newline="") as file:

    fieldnames = claims[0].keys()

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(claims)

print("Preprocessing completed!")
print("Processed claims:", len(claims))
print("Created: data/processed_claims.csv")