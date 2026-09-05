import csv

# Read risk results
with open("outputs/risk_results.csv", "r") as file:
    claims = list(csv.DictReader(file))

for claim in claims:

    score = int(float(claim["risk_score"]))
    level = claim["risk_level"]
    reasons = claim["reasons"]

    # Decide recommended action
    if score >= 76:
        action = "Conduct field verification and verify land records"
    elif score >= 51:
        action = "Review claim documents and processing history"
    elif score >= 31:
        action = "Perform additional document verification"
    else:
        action = "No immediate action required"

    claim["recommended_action"] = action

# Save explanation results
with open("outputs/explained_claims.csv", "w", newline="") as file:

    fieldnames = [
        "claim_id",
        "state",
        "district",
        "risk_score",
        "risk_level",
        "reasons",
        "recommended_action"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    for claim in claims:
        writer.writerow({
            "claim_id": claim["claim_id"],
            "state": claim["state"],
            "district": claim["district"],
            "risk_score": claim["risk_score"],
            "risk_level": claim["risk_level"],
            "reasons": claim["reasons"],
            "recommended_action": claim["recommended_action"]
        })

print("Explainability completed!")
print("Created: outputs/explained_claims.csv")