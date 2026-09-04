import { useEffect, useState } from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import {
  getClaims,
  getAnomalies,
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

interface Report {
  id: string;
  title: string;
  district: string;
  date: string;
  status: string;
  type: "district" | "anomaly" | "overview";
}

function Reports() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        setError("");

        const [claimsData, anomaliesData] =
          await Promise.all([
            getClaims(),
            getAnomalies(),
          ]);

        setClaims(claimsData || []);
        setAnomalies(anomaliesData || []);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load reporting data from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  /* -----------------------------
     LIVE METRICS
  ----------------------------- */

  const totalClaims = claims.length;

  const flaggedClaims = new Set(
    anomalies.map((anomaly) => anomaly.claimId)
  ).size;

  const currentDate = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  /* -----------------------------
     DISTRICT DATA
  ----------------------------- */

  const districtCounts: Record<
    string,
    number
  > = {};

  claims.forEach((claim) => {
    districtCounts[claim.district] =
      (districtCounts[claim.district] || 0) + 1;
  });

  const topDistrict =
    Object.entries(districtCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "All Districts";

  /* -----------------------------
     REPORT DEFINITIONS
  ----------------------------- */

  const reports: Report[] = [
    {
      id: "RPT-001",
      title: "District Claim Monitoring Report",
      district: topDistrict,
      date: currentDate,
      status: "Ready",
      type: "district",
    },
    {
      id: "RPT-002",
      title: "Anomaly Detection Summary",
      district: "All Districts",
      date: currentDate,
      status: "Ready",
      type: "anomaly",
    },
    {
      id: "RPT-003",
      title: "Forest Rights Processing Overview",
      district: "All Districts",
      date: currentDate,
      status: "Ready",
      type: "overview",
    },
  ];

  /* -----------------------------
     REPORT CONTENT
  ----------------------------- */

  const getExecutiveSummary = (
    report: Report
  ) => {
    if (report.type === "district") {
      const districtClaims = claims.filter(
        (claim) =>
          claim.district === report.district
      ).length;

      return `The current dataset contains ${districtClaims} claim${
        districtClaims === 1 ? "" : "s"
      } associated with ${report.district}. The report highlights claim status, processing activity and AI-detected signals requiring administrative review.`;
    }

    if (report.type === "anomaly") {
      return `The monitoring system has identified ${anomalies.length} anomaly signal${
        anomalies.length === 1 ? "" : "s"
      } across the available claim dataset. These signals should be reviewed against underlying records and available evidence.`;
    }

    return `The current monitoring dataset contains ${totalClaims} claim${
      totalClaims === 1 ? "" : "s"
    } across ${
      Object.keys(districtCounts).length
    } district${
      Object.keys(districtCounts).length === 1
        ? ""
        : "s"
    }. The report summarizes claim processing activity and detected anomaly signals.`;
  };

  const getKeyFindings = (
    report: Report
  ) => {
    const findings: string[] = [];

    if (report.type === "district") {
      const districtClaims = claims.filter(
        (claim) =>
          claim.district === report.district
      );

      const pending = districtClaims.filter(
        (claim) =>
          claim.status === "PENDING" ||
          claim.status === "UNDER_REVIEW"
      ).length;

      const approved = districtClaims.filter(
        (claim) =>
          claim.status === "APPROVED"
      ).length;

      findings.push(
        `${districtClaims.length} claims are currently associated with ${report.district}.`
      );

      findings.push(
        `${approved} claims are marked approved and ${pending} are pending or under review.`
      );

      const districtAnomalies =
        anomalies.filter((anomaly) =>
          districtClaims.some(
            (claim) =>
              claim.claimId ===
              anomaly.claimId
          )
        ).length;

      findings.push(
        `${districtAnomalies} AI anomaly signal${
          districtAnomalies === 1
            ? ""
            : "s"
        } are associated with this district.`
      );
    }

    if (report.type === "anomaly") {
      const anomalyTypes: Record<
        string,
        number
      > = {};

      anomalies.forEach((anomaly) => {
        anomalyTypes[anomaly.type] =
          (anomalyTypes[anomaly.type] || 0) +
          1;
      });

      const topAnomaly = Object.entries(
        anomalyTypes
      ).sort(
        (a, b) => b[1] - a[1]
      )[0];

      if (topAnomaly) {
        findings.push(
          `${topAnomaly[1]} signal${
            topAnomaly[1] === 1
              ? ""
              : "s"
          } are associated with ${topAnomaly[0]}.`
        );
      }

      const highRisk = anomalies.filter(
        (anomaly) =>
          anomaly.severity === "HIGH" ||
          anomaly.severity === "CRITICAL"
      ).length;

      findings.push(
        `${highRisk} high-severity or critical signal${
          highRisk === 1
            ? ""
            : "s"
        } require priority review.`
      );

      findings.push(
        `${flaggedClaims} unique claim${
          flaggedClaims === 1
            ? ""
            : "s"
        } currently have at least one flagged signal.`
      );
    }

    if (report.type === "overview") {
      const approved = claims.filter(
        (claim) =>
          claim.status === "APPROVED"
      ).length;

      const pending = claims.filter(
        (claim) =>
          claim.status === "PENDING" ||
          claim.status === "UNDER_REVIEW"
      ).length;

      const rejected = claims.filter(
        (claim) =>
          claim.status === "REJECTED"
      ).length;

      findings.push(
        `${approved} claims are approved, ${pending} are pending or under review, and ${rejected} are rejected.`
      );

      findings.push(
        `${Object.keys(districtCounts).length} districts are represented in the current dataset.`
      );

      findings.push(
        `${flaggedClaims} claims have one or more AI-detected anomaly signals.`
      );
    }

    return findings;
  };

  const getFollowUp = (
    report: Report
  ) => {
    if (report.type === "anomaly") {
      return "Prioritize high-severity anomaly signals for verification against source records. Where appropriate, conduct field verification before administrative action.";
    }

    if (report.type === "district") {
      return `Review pending claims and flagged signals associated with ${report.district}. Verify relevant records and supporting evidence before taking administrative action.`;
    }

    return "Use the aggregated findings to identify areas requiring further review. AI observations should be validated against source records and applicable procedures.";
  };

  /* -----------------------------
     EXPORT
  ----------------------------- */

  const handleExport = () => {
    if (!selectedReport) return;

    const summary = getExecutiveSummary(
      selectedReport
    );

    const findings = getKeyFindings(
      selectedReport
    );

    const followUp = getFollowUp(
      selectedReport
    );

    const content = `
VANADHIKAR
${selectedReport.title}

Report ID: ${selectedReport.id}
Scope: ${selectedReport.district}
Generated: ${selectedReport.date}

CLAIMS ANALYSED
${totalClaims}

FLAGGED SIGNALS
${flaggedClaims}

EXECUTIVE SUMMARY
${summary}

KEY FINDINGS
${findings.map((item) => `- ${item}`).join("\n")}

RECOMMENDED FOLLOW-UP
${followUp}

REPORTING NOTE
Reports are intended to support monitoring and administrative review. AI-generated observations should be verified against source records and applicable procedures before action is taken.
`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      `${selectedReport.id}-VanAdhikar-Report.txt`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="officer-dashboard">
      <DashboardNavbar role="officer" />

      <section className="reports-page">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-tag">
              REPORTING CENTER
            </p>

            <h1>Reports</h1>

            <p>
              Generate structured summaries of claim
              activity, anomaly signals and
              district-level insights.
            </p>
          </div>

          <div className="dashboard-status">
            <span></span>

            {loading
              ? "LOADING DATA"
              : "REPORT SYSTEM READY"}
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* REPORT GENERATOR */}

        <div className="report-generator">

          <div>
            <p className="detail-label">
              AI-ASSISTED REPORTING
            </p>

            <h2>
              Create a monitoring report
            </h2>

            <p>
              Select a reporting scope to prepare
              a structured summary using the
              current monitoring dataset.
            </p>
          </div>

          <div className="report-options">

            <button
              disabled={loading}
              onClick={() =>
                setSelectedReport(
                  reports[0]
                )
              }
            >
              <span>01</span>

              <strong>
                District Report
              </strong>

              <small>
                Claims and anomalies for the
                most represented district
              </small>
            </button>

            <button
              disabled={loading}
              onClick={() =>
                setSelectedReport(
                  reports[1]
                )
              }
            >
              <span>02</span>

              <strong>
                Anomaly Report
              </strong>

              <small>
                Summary of detected unusual
                patterns
              </small>
            </button>

            <button
              disabled={loading}
              onClick={() =>
                setSelectedReport(
                  reports[2]
                )
              }
            >
              <span>03</span>

              <strong>
                Overview Report
              </strong>

              <small>
                Aggregated monitoring across
                districts
              </small>
            </button>

          </div>

        </div>

        {/* GENERATED REPORT */}

        {selectedReport && (

          <div className="generated-report">

            <div className="generated-report-header">

              <div>
                <p className="detail-label">
                  REPORT PREVIEW
                </p>

                <h2>
                  {selectedReport.title}
                </h2>

                <p>
                  {selectedReport.district} ·{" "}
                  {selectedReport.date}
                </p>
              </div>

              <button
                className="close-report"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                ×
              </button>

            </div>

            <div className="report-summary-grid">

              <div>
                <span>
                  REPORT ID
                </span>

                <strong>
                  {selectedReport.id}
                </strong>
              </div>

              <div>
                <span>
                  CLAIMS ANALYSED
                </span>

                <strong>
                  {totalClaims}
                </strong>
              </div>

              <div>
                <span>
                  FLAGGED SIGNALS
                </span>

                <strong>
                  {flaggedClaims}
                </strong>
              </div>

              <div>
                <span>
                  STATUS
                </span>

                <strong>
                  READY
                </strong>
              </div>

            </div>

            <div className="report-sections">

              <div>
                <p>
                  EXECUTIVE SUMMARY
                </p>

                <h3>
                  {getExecutiveSummary(
                    selectedReport
                  )}
                </h3>

                <p>
                  The observations presented here
                  are generated from the current
                  VanAdhikar monitoring dataset.
                </p>
              </div>

              <div>
                <p>
                  KEY FINDINGS
                </p>

                <ul>
                  {getKeyFindings(
                    selectedReport
                  ).map(
                    (
                      finding,
                      index
                    ) => (
                      <li key={index}>
                        {finding}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <p>
                  RECOMMENDED FOLLOW-UP
                </p>

                <p>
                  {getFollowUp(
                    selectedReport
                  )}
                </p>
              </div>

            </div>

            <div className="report-actions">

              <button
                className="primary-button"
                onClick={() => {
                  alert(
                    "Report generated successfully."
                  );
                }}
              >
                Generate Report
              </button>

              <button
                className="secondary-button"
                onClick={handleExport}
              >
                Export Summary
              </button>

            </div>

          </div>

        )}

        {/* PREVIOUS REPORTS */}

        <div className="previous-reports">

          <div className="reports-section-header">

            <div>
              <p className="detail-label">
                REPORT ARCHIVE
              </p>

              <h2>
                Previous Reports
              </h2>
            </div>

          </div>

          <div className="reports-list">

            {reports.map(
              (report) => (

                <div
                  className="report-row"
                  key={report.id}
                >

                  <div className="report-id">
                    {report.id}
                  </div>

                  <div className="report-info">

                    <strong>
                      {report.title}
                    </strong>

                    <p>
                      {report.district} ·{" "}
                      {report.date}
                    </p>

                  </div>

                  <span className="report-ready">
                    {report.status}
                  </span>

                  <button
                    className="report-view"
                    onClick={() =>
                      setSelectedReport(
                        report
                      )
                    }
                  >
                    View →
                  </button>

                </div>

              )
            )}

          </div>

        </div>

        {/* NOTE */}

        <div className="analytics-note">

          <strong>
            REPORTING NOTE
          </strong>

          <p>
            Reports are intended to support
            monitoring and administrative review.
            AI-generated observations should be
            verified against source records and
            applicable procedures before action is
            taken.
          </p>

        </div>

      </section>
    </main>
  );
}

export default Reports;