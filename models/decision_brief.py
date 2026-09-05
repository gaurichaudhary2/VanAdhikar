import csv

with open("outputs/explained_claims.csv", "r") as file:
    claims = list(csv.DictReader(file))

briefs = []

for claim in claims:

    score = int(float(claim["risk_score"]))
    level = claim["risk_level"]

    if level == "CRITICAL":
        priority = "Immediate"
        summary = (
            "This claim requires immediate attention because multiple "
            "risk indicators have been detected."
        )

    elif level == "HIGH":
        priority = "High"
        summary = (
            "This claim shows significant risk indicators and should "
            "be reviewed by the concerned authority."
        )

    elif level == "MEDIUM":
        priority = "Moderate"
        summary = (
            "This claim has some risk indicators and may require "
            "additional verification."
        )

    else:
        priority = "Normal"
        summary = (
            "No major risk indicators were detected for this claim."
        )

    brief = (
        f"Claim {claim['claim_id']} from {claim['district']}, "
        f"{claim['state']} has a risk score of {score}/100 "
        f"({level}). {summary} "
        f"Key factors: {claim['reasons']}. "
        f"Recommended action: {claim['recommended_action']}. "
        f"Final decision must be made by the authorized official."
    )

    briefs.append({
        "claim_id": claim["claim_id"],
        "state": claim["state"],
        "district": claim["district"],
        "risk_score": score,
        "risk_level": level,
        "priority": priority,
        "decision_brief": brief
    })


with open("outputs/decision_briefs.csv", "w", newline="") as file:

    fieldnames = [
        "claim_id",
        "state",
        "district",
        "risk_score",
        "risk_level",
        "priority",
        "decision_brief"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(briefs)


print("AI Decision Brief generation completed!")
print("Created: outputs/decision_briefs.csv")