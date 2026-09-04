import Claim from "../models/Claim";
import Anomaly from "../models/Anomaly";

export const getDistrictDecision = async (district: string) => {
  const claims = await Claim.find({ district });

  if (claims.length === 0) {
    return {
      district,
      message: "No claim data available for this district.",
    };
  }

  const claimIds = claims.map((claim) => claim.claimId);

  const anomalies = await Anomaly.find({
    claimId: { $in: claimIds },
    resolved: false,
  });

  const pending = claims.filter(
    (claim) => claim.status === "PENDING"
  ).length;

  const approved = claims.filter(
    (claim) => claim.status === "APPROVED"
  ).length;

  const highRisk = anomalies.filter(
    (a) => a.severity === "HIGH" || a.severity === "CRITICAL"
  ).length;

  const landMismatch = anomalies.filter(
    (a) => a.type === "LAND_MISMATCH"
  ).length;

  const delayed = anomalies.filter(
    (a) => a.type === "DELAYED_CLAIM"
  ).length;

  let priority = "LOW";
  let recommendation =
    "Continue routine monitoring of claims.";

  if (highRisk > 0) {
    priority = "HIGH";
    recommendation =
      "Prioritize field verification of high-risk claims.";
  } else if (landMismatch > 0 || delayed > 0) {
    priority = "MEDIUM";
    recommendation =
      "Review land records and expedite delayed claims.";
  }

  return {
    district,

    summary: {
      totalClaims: claims.length,
      approved,
      pending,
      anomalies: anomalies.length,
      highRiskAnomalies: highRisk,
      landMismatches: landMismatch,
      delayedClaims: delayed,
    },

    decision: {
      priority,
      recommendation,
    },

    flaggedClaims: anomalies.map((anomaly) => ({
      claimId: anomaly.claimId,
      type: anomaly.type,
      severity: anomaly.severity,
      riskScore: anomaly.riskScore,
      description: anomaly.description,
    })),
  };
};