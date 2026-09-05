import csv
from collections import Counter, defaultdict

with open("outputs/risk_results.csv", "r") as file:
    claims = list(csv.DictReader(file))


total_claims = len(claims)

anomalies = sum(
    1 for claim in claims
    if claim["ml_anomaly"] == "YES"
)

risk_counts = Counter(
    claim["risk_level"]
    for claim in claims
)

district_data = defaultdict(list)

for claim in claims:
    district_data[claim["district"]].append(
        int(float(claim["risk_score"]))
    )


district_stats = []

for district, scores in district_data.items():

    average_score = round(
        sum(scores) / len(scores),
        2
    )

    high_risk = sum(
        1 for score in scores
        if score >= 51
    )

    district_stats.append({
        "district": district,
        "total_claims": len(scores),
        "average_risk_score": average_score,
        "high_risk_claims": high_risk
    })


with open("outputs/dashboard_summary.csv", "w", newline="") as file:

    fieldnames = [
        "metric",
        "value"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    writer.writerow({
        "metric": "total_claims",
        "value": total_claims
    })

    writer.writerow({
        "metric": "ml_anomalies",
        "value": anomalies
    })

    writer.writerow({
        "metric": "critical_claims",
        "value": risk_counts["CRITICAL"]
    })

    writer.writerow({
        "metric": "high_risk_claims",
        "value": risk_counts["HIGH"]
    })

    writer.writerow({
        "metric": "medium_risk_claims",
        "value": risk_counts["MEDIUM"]
    })

    writer.writerow({
        "metric": "low_risk_claims",
        "value": risk_counts["LOW"]
    })


with open("outputs/district_risk_summary.csv", "w", newline="") as file:

    fieldnames = [
        "district",
        "total_claims",
        "average_risk_score",
        "high_risk_claims"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(district_stats)


print("Dashboard analytics completed!")
print("Created: outputs/dashboard_summary.csv")
print("Created: outputs/district_risk_summary.csv")