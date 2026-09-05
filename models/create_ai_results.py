import csv

with open("outputs/risk_results.csv", "r") as file:
    claims = list(csv.DictReader(file))

with open("outputs/decision_briefs.csv", "r") as file:
    briefs = {
        row["claim_id"]: row
        for row in csv.DictReader(file)
    }


final_results = []

for claim in claims:

    claim_id = claim["claim_id"]

    brief = briefs.get(claim_id, {})

    final_results.append({
        "claim_id": claim_id,
        "state": claim["state"],
        "district": claim["district"],
        "latitude": claim["latitude"],
        "longitude": claim["longitude"],
        "ml_anomaly": claim["ml_anomaly"],
        "risk_score": claim["risk_score"],
        "risk_level": claim["risk_level"],
        "reasons": claim["reasons"],
        "recommended_action": claim.get(
            "recommended_action",
            ""
        ),
        "priority": brief.get(
            "priority",
            ""
        ),
        "decision_brief": brief.get(
            "decision_brief",
            ""
        )
    })


with open("outputs/ai_results.csv", "w", newline="") as file:

    fieldnames = [
        "claim_id",
        "state",
        "district",
        "latitude",
        "longitude",
        "ml_anomaly",
        "risk_score",
        "risk_level",
        "reasons",
        "recommended_action",
        "priority",
        "decision_brief"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(final_results)


print("Final AI results created!")
print("Total AI results:", len(final_results))
print("Created: outputs/ai_results.csv")