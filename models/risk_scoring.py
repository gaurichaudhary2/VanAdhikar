import csv

# Read anomaly results
with open("outputs/anomaly_results.csv", "r") as file:
    claims = list(csv.DictReader(file))

for claim in claims:

    score = 0
    reasons = []

    # 1. Process aging
    processing_days = float(claim["processing_days"])

    if processing_days > 180:
        score += 25
        reasons.append("Severe processing delay")
    elif processing_days > 120:
        score += 15
        reasons.append("Long processing delay")

    # 2. Area mismatch
    mismatch = float(claim["area_mismatch_percentage"])

    if mismatch > 30:
        score += 25
        reasons.append("Large area mismatch")
    elif mismatch > 15:
        score += 15
        reasons.append("Area mismatch")

    # 3. Spatial overlap
    overlap = float(claim["overlap_percentage"])

    if overlap > 70:
        score += 25
        reasons.append("High claim overlap")
    elif overlap > 40:
        score += 15
        reasons.append("Moderate claim overlap")

    # 4. Missing documents
    if claim["documents_complete"] == "0":
        score += 10
        reasons.append("Missing documents")

    # 5. Missing land record
    if claim["land_record_available"] == "0":
        score += 10
        reasons.append("Land record unavailable")

    # 6. Previous rejections
    rejections = int(float(claim["previous_rejections"]))

    if rejections >= 2:
        score += 5
        reasons.append("Multiple previous rejections")

    # 7. ML anomaly
    if claim["ml_anomaly"] == "YES":
        score += 10
        reasons.append("ML anomaly detected")

    # Maximum score = 100
    score = min(score, 100)

    # Risk level
    if score >= 76:
        risk_level = "CRITICAL"
    elif score >= 51:
        risk_level = "HIGH"
    elif score >= 31:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    claim["risk_score"] = score
    claim["risk_level"] = risk_level
    claim["reasons"] = " | ".join(reasons)

# Save results
with open("outputs/risk_results.csv", "w", newline="") as file:

    fieldnames = claims[0].keys()

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(claims)

print("Risk scoring completed!")
print("Created: outputs/risk_results.csv")