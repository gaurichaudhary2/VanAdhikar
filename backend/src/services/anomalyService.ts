import Claim from "../models/Claim";
import Anomaly from "../models/Anomaly";

const getSeverity = (score: number) => {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
};

export const analyzeClaims = async () => {
  const claims = await Claim.find();

  // Remove old unresolved anomalies before fresh analysis
  await Anomaly.deleteMany({ resolved: false });

  const anomalies: any[] = [];

  for (const claim of claims) {
    let riskScore = 0;
    const detectedTypes: string[] = [];
    const descriptions: string[] = [];

    // 1. DELAYED CLAIM
    if (claim.status === "PENDING") {
      const daysPending =
        (Date.now() - new Date(claim.submittedDate).getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysPending > 180) {
        riskScore += 25;
        detectedTypes.push("DELAYED_CLAIM");
        descriptions.push(
          `Claim has been pending for approximately ${Math.round(
            daysPending
          )} days.`
        );
      }
    }

    // 2. LAND RECORD MISMATCH
    if (claim.landRecordArea !== undefined) {
      const difference = Math.abs(
        claim.area - claim.landRecordArea
      );

      const mismatchPercentage =
        (difference / claim.area) * 100;

      if (mismatchPercentage > 20) {
        riskScore += 30;
        detectedTypes.push("LAND_MISMATCH");

        descriptions.push(
          `Claimed area (${claim.area} ha) differs from land record area (${claim.landRecordArea} ha) by ${Math.round(
            mismatchPercentage
          )}%.`
        );
      }
    }

    // 3. LARGE APPROVED CLAIM
    if (claim.status === "APPROVED" && claim.area > 7) {
      riskScore += 20;
      detectedTypes.push("UNUSUAL_APPROVAL");

      descriptions.push(
        `Approved claim has unusually large area of ${claim.area} hectares.`
      );
    }

    // 4. GEO-SPATIAL VALIDATION
    if (
      claim.latitude < -90 ||
      claim.latitude > 90 ||
      claim.longitude < -180 ||
      claim.longitude > 180
    ) {
      riskScore += 25;
      detectedTypes.push("GEO_SPATIAL_MISMATCH");

      descriptions.push(
        "Claim contains invalid geographic coordinates."
      );
    }

    // Save each detected anomaly
    for (const type of detectedTypes) {
      const typeScore =
        type === "LAND_MISMATCH"
          ? 30
          : type === "DELAYED_CLAIM"
          ? 25
          : type === "GEO_SPATIAL_MISMATCH"
          ? 25
          : 20;

      const anomalyScore = Math.min(
        riskScore,
        100
      );

      await Anomaly.create({
        claimId: claim.claimId,
        type,
        severity: getSeverity(anomalyScore),
        description: descriptions[detectedTypes.indexOf(type)],
        riskScore: Math.min(typeScore + (riskScore - typeScore), 100),
        resolved: false,
      });

      anomalies.push({
        claimId: claim.claimId,
        type,
        riskScore: anomalyScore,
      });
    }
  }

  return anomalies;
};