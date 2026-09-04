export const getRiskLevel = (score: number) => {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
};

export const calculateRiskScore = (
  landMismatch: boolean,
  delayed: boolean,
  duplicate: boolean,
  geoMismatch: boolean
) => {
  let score = 0;

  if (landMismatch) score += 30;
  if (delayed) score += 25;
  if (duplicate) score += 20;
  if (geoMismatch) score += 25;

  return Math.min(score, 100);
};