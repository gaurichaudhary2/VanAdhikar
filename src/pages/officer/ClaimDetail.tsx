import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import { getClaimById } from "../../services/api";

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

  // These are optional because the current claims API
  // may not provide them.
  riskScore?: number;
  anomaly?: string;
}

function ClaimDetail() {
  const [reviewStarted, setReviewStarted] =
    useState(false);

  const [claim, setClaim] =
    useState<Claim | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadClaim = async () => {
      if (!id) {
        setError("Claim ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getClaimById(id);

        if (!result) {
          setError(
            "The requested claim could not be found."
          );
          return;
        }

        setClaim(result);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load claim details from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClaim();
  }, [id]);

  if (loading) {
    return (
      <main className="dashboard-page">
        <DashboardNavbar role="officer" />

        <div className="dashboard-header">
          <p className="dashboard-tag">
            CLAIM INTELLIGENCE
          </p>

          <h1>Loading claim...</h1>

          <p>
            Fetching the latest claim information from
            the VanAdhikar backend.
          </p>
        </div>
      </main>
    );
  }

  if (error || !claim) {
    return (
      <main className="dashboard-page">
        <DashboardNavbar role="officer" />

        <div className="dashboard-header">
          <p className="dashboard-tag">
            CLAIM NOT FOUND
          </p>

          <h1>Claim unavailable</h1>

          <p>
            {error ||
              "The requested claim could not be found."}
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/officer")}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const riskLevel =
    claim.riskScore !== undefined
      ? claim.riskScore >= 75
        ? "HIGH"
        : claim.riskScore >= 50
        ? "MEDIUM"
        : "LOW"
      : null;

  const formattedStatus =
    claim.status.replace(/_/g, " ");

  return (
    <main className="dashboard-page">
      <DashboardNavbar role="officer" />

      <div className="claim-detail-page">

        {/* Back */}

        <button
          className="back-button"
          onClick={() => navigate("/officer")}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}

        <div className="claim-detail-header">
          <div>
            <p className="dashboard-tag">
              CLAIM INTELLIGENCE
            </p>

            <h1>{claim.claimId}</h1>

            <p className="claim-subtitle">
              {claim.district} District ·{" "}
              {claim.state} · Forest Rights Claim
            </p>
          </div>

          <div
            className={`claim-status ${claim.status
              .toLowerCase()
              .replace(/_/g, "-")}`}
          >
            {formattedStatus}
          </div>
        </div>

        {/* Claim Information */}

        <div className="claim-detail-grid">

          <section className="detail-card">

            <p className="detail-label">
              CLAIM INFORMATION
            </p>

            <div className="detail-row">
              <span>Claimant</span>

              <strong>
                {claim.claimantName}
              </strong>
            </div>

            <div className="detail-row">
              <span>State</span>

              <strong>
                {claim.state}
              </strong>
            </div>

            <div className="detail-row">
              <span>District</span>

              <strong>
                {claim.district}
              </strong>
            </div>

            <div className="detail-row">
              <span>Village</span>

              <strong>
                {claim.village}
              </strong>
            </div>

            <div className="detail-row">
              <span>Claim Type</span>

              <strong>
                {claim.claimType}
              </strong>
            </div>

          </section>

          {/* Land Information */}

          <section className="detail-card">

            <p className="detail-label">
              LAND INFORMATION
            </p>

            <div className="detail-row">
              <span>Claimed Area</span>

              <strong>
                {claim.area} ha
              </strong>
            </div>

            <div className="detail-row">
              <span>Land Record Area</span>

              <strong>
                {claim.landRecordArea} ha
              </strong>
            </div>

            <div className="detail-row">
              <span>Latitude</span>

              <strong>
                {claim.latitude}
              </strong>
            </div>

            <div className="detail-row">
              <span>Longitude</span>

              <strong>
                {claim.longitude}
              </strong>
            </div>

          </section>

        </div>

        {/* Risk Assessment */}

        <div className="claim-detail-grid">

          <section className="detail-card">

            <p className="detail-label">
              RISK ASSESSMENT
            </p>

            {claim.riskScore !== undefined ? (
              <>
                <div className="large-risk-score">
                  <strong>
                    {claim.riskScore}
                  </strong>

                  <span>/100</span>
                </div>

                <div className="risk-bar">
                  <div
                    className="risk-bar-fill"
                    style={{
                      width: `${claim.riskScore}%`,
                    }}
                  />
                </div>

                <p
                  className={`risk-level ${
                    riskLevel?.toLowerCase()
                  }`}
                >
                  {riskLevel} RISK
                </p>
              </>
            ) : (
              <>
                <h2>
                  Risk score unavailable
                </h2>

                <p className="detail-description">
                  A risk score has not been provided by
                  the current claims dataset.
                </p>
              </>
            )}

            <p className="detail-description">
              Risk indicators are intended to support
              officer review and do not determine the
              legal outcome of the claim.
            </p>

          </section>

          {/* AI Signal */}

          <section className="detail-card">

            <p className="detail-label">
              AI SIGNAL
            </p>

            {claim.anomaly ? (
              <>
                <h2>
                  {claim.anomaly} Anomaly
                </h2>

                <p className="detail-description">
                  The system detected an unusual pattern
                  associated with this claim that may
                  require closer examination.
                </p>

                <div className="evidence-list">

                  <div>
                    <span>01</span>

                    <p>
                      Claim processing pattern requires
                      review.
                    </p>
                  </div>

                  <div>
                    <span>02</span>

                    <p>
                      Spatial or record-level indicators
                      should be verified.
                    </p>
                  </div>

                  <div>
                    <span>03</span>

                    <p>
                      Supporting evidence should be
                      reviewed before action.
                    </p>
                  </div>

                </div>
              </>
            ) : (
              <>
                <h2>
                  No anomaly data available
                </h2>

                <p className="detail-description">
                  No anomaly information is currently
                  attached to this claim in the backend
                  claims dataset.
                </p>
              </>
            )}

          </section>

        </div>

        {/* Timeline */}

        <section className="detail-card timeline-card">

          <p className="detail-label">
            CLAIM TIMELINE
          </p>

          <div className="timeline">

            <div className="timeline-item completed">
              <span className="timeline-dot" />

              <div>
                <strong>
                  Claim Submitted
                </strong>

                <p>
                  Application registered on{" "}
                  {new Date(
                    claim.submittedDate
                  ).toLocaleDateString()}
                  .
                </p>
              </div>
            </div>

            <div className="timeline-item completed">
              <span className="timeline-dot" />

              <div>
                <strong>
                  Initial Verification
                </strong>

                <p>
                  Basic claim and supporting records
                  entered the verification process.
                </p>
              </div>
            </div>

            <div className="timeline-item active">
              <span className="timeline-dot" />

              <div>
                <strong>
                  Current Stage
                </strong>

                <p>
                  Claim is currently marked as{" "}
                  <b>{formattedStatus}</b>.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-dot" />

              <div>
                <strong>
                  Final Review
                </strong>

                <p>
                  Pending completion of the applicable
                  review process.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Action + Decision */}

        <div className="claim-detail-grid">

          <section className="detail-card">

            <p className="detail-label">
              RECOMMENDED ACTION
            </p>

            <h2>
              Review supporting evidence
            </h2>

            <p className="detail-description">
              Verify the claim records, spatial
              information and supporting documentation
              before taking further action.
            </p>

            <button
              className="detail-action"
              onClick={() =>
                setReviewStarted(true)
              }
            >
              {reviewStarted
                ? "Review Started ✓"
                : "Start Review →"}
            </button>

            {reviewStarted && (
              <p className="review-success">
                This claim has been marked for officer
                review.
              </p>
            )}

          </section>

          <section className="detail-card">

            <p className="detail-label">
              DECISION NOTE
            </p>

            <h2>
              AI-assisted insight
            </h2>

            <p className="detail-description">
              This recommendation is intended as
              decision support. Final decisions remain
              with the authorized authorities under the
              applicable Forest Rights process.
            </p>

          </section>

        </div>

      </div>
    </main>
  );
}

export default ClaimDetail;