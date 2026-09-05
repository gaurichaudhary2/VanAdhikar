from flask import Flask, jsonify
import csv

app = Flask(__name__)

AI_RESULTS_FILE = "outputs/ai_results.csv"
SUMMARY_FILE = "outputs/dashboard_summary.csv"


def load_ai_results():
    with open(AI_RESULTS_FILE, "r") as file:
        return list(csv.DictReader(file))


def load_summary():
    with open(SUMMARY_FILE, "r") as file:
        return {
            row["metric"]: row["value"]
            for row in csv.DictReader(file)
        }


@app.route("/")
def home():
    return jsonify({
        "message": "FRA Sentinel AI API is running"
    })


@app.route("/claims")
def claims():
    return jsonify(load_ai_results())


@app.route("/anomalies")
def anomalies():

    results = load_ai_results()

    anomaly_results = [
        claim
        for claim in results
        if claim["ml_anomaly"] == "YES"
    ]

    return jsonify(anomaly_results)


@app.route("/risk-summary")
def risk_summary():

    summary = load_summary()

    return jsonify(summary)


@app.route("/claim/<claim_id>")
def claim_details(claim_id):

    results = load_ai_results()

    for claim in results:

        if claim["claim_id"] == claim_id:
            return jsonify(claim)

    return jsonify({
        "error": "Claim not found"
    }), 404


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )