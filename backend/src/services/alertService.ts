import Alert from "../models/Alert";
import Anomaly from "../models/Anomaly";

export const generateAlerts = async () => {
  const anomalies = await Anomaly.find({
    resolved: false,
  });

  // Purane alerts delete karke fresh alerts generate karenge
  await Alert.deleteMany({});

  const alerts = [];

  for (const anomaly of anomalies) {
    let title = "FRA Anomaly Detected";

    if (anomaly.type === "LAND_MISMATCH") {
      title = "Land Record Mismatch";
    } else if (anomaly.type === "DELAYED_CLAIM") {
      title = "Delayed FRA Claim";
    } else if (anomaly.type === "UNUSUAL_APPROVAL") {
      title = "Unusual Approval Detected";
    } else if (anomaly.type === "GEO_SPATIAL_MISMATCH") {
      title = "Geo-Spatial Mismatch";
    } else if (anomaly.type === "DUPLICATE_CLAIM") {
      title = "Duplicate Claim Suspected";
    }

    const alert = await Alert.create({
      title,
      message: `${anomaly.description} Claim ID: ${anomaly.claimId}`,
      severity: anomaly.severity,
      claimId: anomaly.claimId,
      read: false,
    });

    alerts.push(alert);
  }

  return alerts;
};