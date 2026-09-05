import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimMap from "../../components/dashboard/ClaimMap";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import {
  getClaims,
  getAnomalies,
  analyzeAnomalies,
  getAlerts,
  generateAlerts,
  markAlertAsRead,
  getDistrictDecision,
  getDashboardOverview,
} from "../../services/api";

interface Claim {
  _id: string;
  claimId: string;
  claimantName: string;
  state: string;
  district: string;
  village: string;
  claimType: string;
  status: string;
  area: number;
  latitude: number;
  longitude: number;
  submittedDate: string;
  decisionDate?: string;
  landRecordArea: number;
  createdAt: string;
  updatedAt: string;
}

interface Anomaly {
  _id?: string;
  claimId: string;
  type: string;
  severity: string;
  description: string;
  riskScore: number;
  resolved?: boolean;
}

interface Alert {
  _id: string;
  title: string;
  message: string;
  severity: string;
  claimId?: string;
  read: boolean;
  createdAt?: string;
}

interface DistrictDecision {
  district: string;
  message?: string;

  summary?: {
    totalClaims: number;
    approved: number;
    pending: number;
    anomalies: number;
    highRiskAnomalies: number;
    landMismatches: number;
    delayedClaims: number;
  };

  decision?: {
    priority: string;
    recommendation: string;
  };

  flaggedClaims?: {
    claimId: string;
    type: string;
    severity: string;
    riskScore: number;
    description: string;
  }[];
}

function getRiskLevel(score: number) {
  if (score >= 75) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
}

function formatAnomalyType(type: string) {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OfficerDashboard() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [overview, setOverview] = useState<{
    totalClaims: number;
    approved: number;
    pending: number;
    rejected: number;
    underReview: number;
    approvalRate: string;
  } | null>(null);

  const [decision, setDecision] =
    useState<DistrictDecision | null>(null);

  const [selectedAnomaly, setSelectedAnomaly] =
    useState<Anomaly | null>(null);

  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] =
    useState(false);
  const [alertsLoading, setAlertsLoading] =
    useState(false);
  const [decisionLoading, setDecisionLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        overviewData,
        claimsData,
        anomaliesData,
        alertsData,
      ] = await Promise.all([
        getDashboardOverview(),
        getClaims(),
        getAnomalies(),
        getAlerts(),
      ]);

      setOverview(overviewData || null);

      const loadedClaims = claimsData || [];

      setClaims(loadedClaims);
      setAnomalies(anomaliesData || []);
      setAlerts(alertsData || []);

      /*
       * Decision Support works district-wise.
       * We use the first district represented in the
       * current backend dataset.
       */
      if (loadedClaims.length > 0) {
        await loadDistrictDecision(
          loadedClaims[0].district
        );
      } else {
        setDecision(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard data from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDistrictDecision = async (
    district: string
  ) => {
    try {
      setDecisionLoading(true);

      const decisionData =
        await getDistrictDecision(district);

      setDecision(decisionData || null);
    } catch (err) {
      console.error(err);

      setDecision(null);
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setError("");

      await analyzeAnomalies();

      const updatedAnomalies =
        await getAnomalies();

      setAnomalies(updatedAnomalies || []);

      if (updatedAnomalies?.length > 0) {
        setSelectedAnomaly(
          updatedAnomalies[0]
        );
      }

      /*
       * Re-fetch decision support because the anomaly
       * analysis may have changed the signals used by it.
       */
      if (claims.length > 0) {
        await loadDistrictDecision(
          claims[0].district
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "AI anomaly analysis failed. Please try again."
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      setAlertsLoading(true);
      setError("");

      const generated =
        await generateAlerts();

      setAlerts(generated || []);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to generate alerts. Please try again."
      );
    } finally {
      setAlertsLoading(false);
    }
  };

  const handleMarkAlertAsRead = async (
    alertId: string
  ) => {
    try {
      const updated =
        await markAlertAsRead(alertId);

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert._id === alertId
            ? updated
            : alert
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to update alert."
      );
    }
  };

  const handleReviewSignal = (
    anomaly: Anomaly
  ) => {
    navigate(
      `/officer/claim/${anomaly.claimId}`
    );
  };

  const handleAlertClaim = (
    claimId?: string
  ) => {
    if (!claimId) return;

    navigate(
      `/officer/claim/${claimId}`
    );
  };

  /*
   * KPI values now primarily come from the backend
   * dashboard overview endpoint.
   */
  const totalClaims =
    overview?.totalClaims ?? claims.length;

  const pendingClaims =
    overview
      ? overview.pending + overview.underReview
      : claims.filter(
          (claim) =>
            claim.status === "PENDING" ||
            claim.status === "UNDER_REVIEW"
        ).length;

  const flaggedCases = anomalies.filter(
    (anomaly) => !anomaly.resolved
  ).length;

  const districtCount = new Set(
    claims.map(
      (claim) => claim.district
    )
  ).size;

  

  const unreadAlerts = alerts.filter(
    (alert) => !alert.read
  ).length;

  return (
    <main className="officer-dashboard">
      <DashboardNavbar role="officer" />

      <section className="officer-content">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-tag">
              OFFICER CONTROL CENTER
            </p>

            <h1>
              Forest Rights Intelligence
            </h1>

            <p>
              Monitor claims, identify anomalies and
              focus attention where intervention may
              be required.
            </p>
          </div>

          <div className="dashboard-status">
            <span></span>
            SYSTEM ACTIVE
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* KPI CARDS */}

        <div className="kpi-grid">

          <div className="kpi-card">
            <p>TOTAL CLAIMS</p>

            <strong>
              {loading ? "..." : totalClaims}
            </strong>

            <span>
              From connected claim database
            </span>
          </div>

          <div className="kpi-card">
            <p>PENDING REVIEW</p>

            <strong>
              {loading ? "..." : pendingClaims}
            </strong>

            <span>
              Pending or under review
            </span>
          </div>

          <div className="kpi-card">
            <p>FLAGGED CASES</p>

            <strong>
              {loading ? "..." : flaggedCases}
            </strong>

            <span>
              Active anomaly signals
            </span>
          </div>

          <div className="kpi-card">
            <p>DISTRICTS</p>

            <strong>
              {loading ? "..." : districtCount}
            </strong>

            <span>
              Represented in current dataset
            </span>
          </div>

        </div>

        {/* MAP + ANOMALY RADAR */}

        <div className="dashboard-main-grid">

          {/* MAP */}

          <div
            className="map-card"
            id="map"
          >
            <div className="card-header">
              <div>
                <p>
                  SPATIAL INTELLIGENCE
                </p>

                <h2>
                  Claim Activity Map
                </h2>
              </div>

              <span className="live-label">
                LIVE VIEW
              </span>
            </div>

            <div className="map-container">
              <ClaimMap />
            </div>
          </div>

          {/* ANOMALY RADAR */}

          <div className="anomaly-card">

            <div className="card-header">
              <div>
                <p>
                  AI ANOMALY RADAR
                </p>

                <h2>
                  Attention Required
                </h2>
              </div>

              <span className="anomaly-count">
                {anomalies.length}
              </span>
            </div>

            <button
              className="detail-action"
              onClick={handleRunAnalysis}
              disabled={analysisLoading}
            >
              {analysisLoading
                ? "Running Analysis..."
                : "Run AI Analysis →"}
            </button>

            <div className="anomaly-list">

              {anomalies.length === 0 &&
                !loading && (
                  <div className="anomaly-item">
                    <h3>
                      No active anomalies
                    </h3>

                    <p className="anomaly-description">
                      Run AI Analysis to evaluate
                      the current claim dataset.
                    </p>
                  </div>
                )}

              {anomalies.map(
                (anomaly, index) => (
                  <div
                    className="anomaly-item"
                    key={
                      anomaly._id ||
                      `${anomaly.claimId}-${anomaly.type}-${index}`
                    }
                  >

                    <div className="anomaly-top">

                      <span
                        className={
                          anomaly.severity ===
                            "HIGH" ||
                          anomaly.severity ===
                            "CRITICAL"
                            ? "severity high"
                            : "severity medium"
                        }
                      >
                        {anomaly.severity}
                      </span>

                      <span className="anomaly-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                    </div>

                    <h3>
                      {formatAnomalyType(
                        anomaly.type
                      )}
                    </h3>

                    <p className="anomaly-location">
                      Claim {anomaly.claimId}
                    </p>

                    <p className="anomaly-description">
                      {anomaly.description}
                    </p>

                    <p className="anomaly-description">
                      Risk Score:{" "}
                      <strong>
                        {anomaly.riskScore}/100
                      </strong>
                    </p>

                    <button
                      className="review-button"
                      onClick={() =>
                        setSelectedAnomaly(
                          anomaly
                        )
                      }
                    >
                      Explain Signal →
                    </button>

                    <button
                      className="review-button"
                      onClick={() =>
                        handleReviewSignal(
                          anomaly
                        )
                      }
                    >
                      Review Claim →
                    </button>

                  </div>
                )
              )}

            </div>

            {/* EXPLAINABLE RISK PANEL */}

            {selectedAnomaly && (
              <div className="risk-panel">

                <div className="risk-panel-header">

                  <div>
                    <p>
                      EXPLAINABLE RISK SIGNAL
                    </p>

                    <h3>
                      {formatAnomalyType(
                        selectedAnomaly.type
                      )}
                    </h3>
                  </div>

                  <button
                    className="close-risk"
                    onClick={() =>
                      setSelectedAnomaly(null)
                    }
                  >
                    ×
                  </button>

                </div>

                <div className="risk-location">
                  Claim{" "}
                  {selectedAnomaly.claimId}
                </div>

                <div className="risk-score-box">

                  <div className="risk-score-header">
                    <span>
                      RISK SCORE
                    </span>

                    <strong>
                      {selectedAnomaly.riskScore}/100
                    </strong>
                  </div>

                  <div className="risk-bar">
                    <div
                      className="risk-bar-fill"
                      style={{
                        width: `${Math.min(
                          selectedAnomaly.riskScore,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <p>
                    {getRiskLevel(
                      selectedAnomaly.riskScore
                    )}{" "}
                    RISK · Requires closer review
                  </p>

                </div>

                <div className="risk-section">

                  <span>
                    WHY WAS IT FLAGGED?
                  </span>

                  <p>
                    {selectedAnomaly.description}
                  </p>

                </div>

                <div className="risk-section">

                  <span>
                    DETECTED SIGNAL
                  </span>

                  <ul>

                    <li>
                      {formatAnomalyType(
                        selectedAnomaly.type
                      )}{" "}
                      detected by the current
                      anomaly analysis.
                    </li>

                    <li>
                      Risk score:{" "}
                      {selectedAnomaly.riskScore}
                      /100.
                    </li>

                    <li>
                      Claim requires additional
                      verification before action.
                    </li>

                  </ul>

                </div>

                <div className="risk-section">

                  <span>
                    RECOMMENDED ACTION
                  </span>

                  <p>
                    Review the underlying claim
                    records and supporting evidence.
                    Consider field verification where
                    appropriate before an administrative
                    decision.
                  </p>

                </div>

                <button
                  className="risk-action"
                  onClick={() =>
                    handleReviewSignal(
                      selectedAnomaly
                    )
                  }
                >
                  Review Claim →
                </button>

              </div>
            )}

          </div>

        </div>

        {/* LOWER SECTION */}

        <div className="lower-dashboard-grid">

          {/* DECISION SUPPORT */}

          <div className="attention-card">

            <p>
              DECISION SUPPORT
            </p>

            <h2>
              Where should attention go next?
            </h2>

            {decisionLoading ? (

              <div className="recommendation">
                <span>01</span>

                <div>
                  <strong>
                    Generating district insight...
                  </strong>

                  <p>
                    Analysing current claim and
                    anomaly data.
                  </p>
                </div>
              </div>

            ) : !decision ? (

              <div className="recommendation">
                <span>01</span>

                <div>
                  <strong>
                    No decision support available
                  </strong>

                  <p>
                    No claim data is currently
                    available for district analysis.
                  </p>
                </div>
              </div>

            ) : decision.message ? (

              <div className="recommendation">
                <span>01</span>

                <div>
                  <strong>
                    {decision.district} District
                  </strong>

                  <p>
                    {decision.message}
                  </p>
                </div>
              </div>

            ) : (

              <>

                <div className="recommendation">
                  <span>01</span>

                  <div>
                    <strong>
                      {decision.district} District ·{" "}
                      {decision.decision?.priority ||
                        "LOW"}{" "}
                      Priority
                    </strong>

                    <p>
                      {decision.decision
                        ?.recommendation}
                    </p>
                  </div>
                </div>

                {decision.summary && (
                  <div className="recommendation">
                    <span>02</span>

                    <div>
                      <strong>
                        Current district signals
                      </strong>

                      <p>
                        {decision.summary.totalClaims}{" "}
                        claims ·{" "}
                        {decision.summary.pending}{" "}
                        pending ·{" "}
                        {decision.summary.highRiskAnomalies}{" "}
                        high-risk anomalies ·{" "}
                        {decision.summary.landMismatches}{" "}
                        land mismatches ·{" "}
                        {decision.summary.delayedClaims}{" "}
                        delayed claims.
                      </p>
                    </div>
                  </div>
                )}

                {decision.flaggedClaims &&
                  decision.flaggedClaims.length >
                    0 && (
                    <div className="recommendation">
                      <span>03</span>

                      <div>
                        <strong>
                          Flagged claims requiring
                          attention
                        </strong>

                        <p>
                          {decision.flaggedClaims
                            .slice(0, 3)
                            .map(
                              (flaggedClaim) =>
                                flaggedClaim.claimId
                            )
                            .join(", ")}
                          {decision.flaggedClaims.length >
                          3
                            ? " and more."
                            : "."}
                        </p>
                      </div>
                    </div>
                  )}

              </>

            )}

            <p
              style={{
                marginTop: "16px",
                fontSize: "11px",
                lineHeight: "1.5",
                color: "#758a7c",
              }}
            >
              Decision support is generated from
              current district claim and anomaly data.
              It supports officer review and does not
              make legal or rights determinations.
            </p>

          </div>

          {/* ALERT CENTER */}

          <div className="activity-card alerts-card">

            <div className="alerts-header">

              <div>
                <p>
                  ALERT CENTER
                </p>

                <h2>
                  System Alerts
                </h2>
              </div>

              <span className="anomaly-count">
                {unreadAlerts}
              </span>

            </div>

            <button
              className="detail-action"
              onClick={handleGenerateAlerts}
              disabled={alertsLoading}
            >
              {alertsLoading
                ? "Generating Alerts..."
                : "Generate Alerts →"}
            </button>

            <div className="alerts-list">

              {alerts.length === 0 ? (

                <div className="alert-empty">
                  <strong>
                    No alerts available
                  </strong>

                  <p>
                    Generate alerts to surface
                    important claim and anomaly
                    events.
                  </p>
                </div>

              ) : (

                alerts.slice(0, 6).map(
                  (alert) => (
                    <div
                      className={`alert-item ${
                        alert.read
                          ? "read"
                          : "unread"
                      }`}
                      key={alert._id}
                    >

                      <div className="alert-item-top">

                        <span
                          className={`alert-severity ${alert.severity.toLowerCase()}`}
                        >
                          {alert.severity}
                        </span>

                        {!alert.read && (
                          <span className="alert-unread">
                            NEW
                          </span>
                        )}

                      </div>

                      <strong>
                        {alert.title}
                      </strong>

                      <p>
                        {alert.message}
                      </p>

                      {alert.claimId && (
                        <span className="alert-claim">
                          Claim{" "}
                          {alert.claimId}
                        </span>
                      )}

                      <div className="alert-actions">

                        {!alert.read && (
                          <button
                            onClick={() =>
                              handleMarkAlertAsRead(
                                alert._id
                              )
                            }
                          >
                            Mark Read
                          </button>
                        )}

                        {alert.claimId && (
                          <button
                            onClick={() =>
                              handleAlertClaim(
                                alert.claimId
                              )
                            }
                          >
                            Review Claim
                          </button>
                        )}

                      </div>

                      {alert.createdAt && (
                        <p
                          style={{
                            marginTop: "8px",
                            fontSize: "10px",
                          }}
                        >
                          {formatDate(
                            alert.createdAt
                          )}
                        </p>
                      )}

                    </div>
                  )
                )

              )}

            </div>

          </div>

        </div>

      </section>
    </main>
  );
}

export default OfficerDashboard;
