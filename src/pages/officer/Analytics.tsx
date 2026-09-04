import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

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

function formatAnomalyType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Analytics() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
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
          "Unable to load analytics data from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  /* -----------------------------
     STATUS CALCULATIONS
  ----------------------------- */

  const approvedCount = claims.filter(
    (claim) => claim.status === "APPROVED"
  ).length;

  const pendingCount = claims.filter(
    (claim) =>
      claim.status === "PENDING" ||
      claim.status === "UNDER_REVIEW"
  ).length;

  const rejectedCount = claims.filter(
    (claim) => claim.status === "REJECTED"
  ).length;

  const totalClaims = claims.length;

  const approvalRate =
    totalClaims > 0
      ? Math.round(
          (approvedCount / totalClaims) * 100
        )
      : 0;

  const pendingRate =
    totalClaims > 0
      ? Math.round(
          (pendingCount / totalClaims) * 100
        )
      : 0;

  const anomalyClaimIds = new Set(
    anomalies.map((anomaly) => anomaly.claimId)
  );

  const anomalyRate =
    totalClaims > 0
      ? (
          (anomalyClaimIds.size / totalClaims) *
          100
        ).toFixed(1)
      : "0.0";

  const activeDistricts = new Set(
    claims.map((claim) => claim.district)
  ).size;

  /* -----------------------------
     DISTRICT DATA
  ----------------------------- */

  const districtMap: Record<
    string,
    {
      district: string;
      approved: number;
      pending: number;
      rejected: number;
    }
  > = {};

  claims.forEach((claim) => {
    if (!districtMap[claim.district]) {
      districtMap[claim.district] = {
        district: claim.district,
        approved: 0,
        pending: 0,
        rejected: 0,
      };
    }

    if (claim.status === "APPROVED") {
      districtMap[claim.district].approved++;
    } else if (
      claim.status === "PENDING" ||
      claim.status === "UNDER_REVIEW"
    ) {
      districtMap[claim.district].pending++;
    } else if (claim.status === "REJECTED") {
      districtMap[claim.district].rejected++;
    }
  });

  const districtData = Object.values(districtMap)
    .sort(
      (a, b) =>
        b.approved +
        b.pending +
        b.rejected -
        (a.approved +
          a.pending +
          a.rejected)
    )
    .slice(0, 8);

  /* -----------------------------
     STATUS PIE DATA
  ----------------------------- */

  const statusData = [
    {
      name: "Approved",
      value: approvedCount,
    },
    {
      name: "Pending",
      value: pendingCount,
    },
    {
      name: "Rejected",
      value: rejectedCount,
    },
  ].filter((item) => item.value > 0);

  /* -----------------------------
     MONTHLY TREND
  ----------------------------- */

  const monthMap: Record<string, number> = {};

  claims.forEach((claim) => {
    const date = new Date(claim.submittedDate);

    if (isNaN(date.getTime())) {
      return;
    }

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    monthMap[month] =
      (monthMap[month] || 0) + 1;
  });

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trendData = monthOrder
    .filter((month) => monthMap[month] !== undefined)
    .map((month) => ({
      month,
      claims: monthMap[month],
    }));

  /* -----------------------------
     ANOMALY DATA
  ----------------------------- */

  const anomalyMap: Record<string, number> = {};

  anomalies.forEach((anomaly) => {
    const type = formatAnomalyType(
      anomaly.type
    );

    anomalyMap[type] =
      (anomalyMap[type] || 0) + 1;
  });

  const anomalyData = Object.entries(
    anomalyMap
  )
    .map(([type, count]) => ({
      type,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="officer-dashboard">
      <DashboardNavbar role="officer" />

      <section className="analytics-page">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-tag">
              ANALYTICS & INSIGHTS
            </p>

            <h1>Claim Analytics</h1>

            <p>
              Understand claim patterns, processing
              trends and anomaly distribution across
              monitored districts.
            </p>
          </div>

          <div className="dashboard-status">
            <span></span>
            {loading
              ? "LOADING DATA"
              : "DATA UPDATED"}
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}

        <div className="kpi-grid">

          <div className="kpi-card">
            <p>APPROVAL RATE</p>

            <strong>
              {loading ? "..." : `${approvalRate}%`}
            </strong>

            <span>
              Across monitored claims
            </span>
          </div>

          <div className="kpi-card">
            <p>PENDING RATE</p>

            <strong>
              {loading ? "..." : `${pendingRate}%`}
            </strong>

            <span>
              Claims awaiting review
            </span>
          </div>

          <div className="kpi-card">
            <p>ANOMALY RATE</p>

            <strong>
              {loading ? "..." : `${anomalyRate}%`}
            </strong>

            <span>
              Claims with flagged signals
            </span>
          </div>

          <div className="kpi-card">
            <p>ACTIVE DISTRICTS</p>

            <strong>
              {loading ? "..." : activeDistricts}
            </strong>

            <span>
              Currently represented
            </span>
          </div>

        </div>

        {/* CHART GRID */}

        <div className="analytics-grid">

          {/* DISTRICT BAR CHART */}

          <div className="analytics-card large">

            <div className="analytics-card-header">
              <div>
                <p>REGIONAL DISTRIBUTION</p>

                <h2>Claims by District</h2>
              </div>
            </div>

            <div className="chart-container">

              {districtData.length === 0 ? (
                <div className="map-loading">
                  No district data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={districtData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1d3927"
                    />

                    <XAxis
                      dataKey="district"
                      stroke="#758a7c"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      stroke="#758a7c"
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0b1c12",
                        border:
                          "1px solid #315d3c",
                        borderRadius: "6px",
                        color: "#ffffff",
                      }}
                    />

                    <Bar
                      dataKey="approved"
                      stackId="a"
                      fill="#73c98a"
                    />

                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill="#e9a85d"
                    />

                    <Bar
                      dataKey="rejected"
                      stackId="a"
                      fill="#d86b6b"
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>

            <div className="chart-legend">

              <span>
                <i className="legend-approved"></i>
                Approved
              </span>

              <span>
                <i className="legend-pending"></i>
                Pending
              </span>

              <span>
                <i className="legend-rejected"></i>
                Rejected
              </span>

            </div>

          </div>

          {/* STATUS PIE */}

          <div className="analytics-card">

            <div className="analytics-card-header">
              <div>
                <p>CLAIM STATUS</p>

                <h2>Current Distribution</h2>
              </div>
            </div>

            <div className="pie-container">

              {statusData.length === 0 ? (
                <div className="map-loading">
                  No status data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map(
                        (item) => (
                          <Cell
                            key={item.name}
                            fill={
                              item.name ===
                              "Approved"
                                ? "#73c98a"
                                : item.name ===
                                  "Pending"
                                ? "#e9a85d"
                                : "#d86b6b"
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#0b1c12",
                        border:
                          "1px solid #315d3c",
                        borderRadius: "6px",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>
              )}

              <div className="pie-center">
                <strong>100%</strong>
                <span>Claims</span>
              </div>

            </div>

            <div className="status-list">

              {statusData.map(
                (item, index) => {

                  const percentage =
                    totalClaims > 0
                      ? Math.round(
                          (item.value /
                            totalClaims) *
                            100
                        )
                      : 0;

                  return (
                    <div key={item.name}>

                      <span>
                        <i
                          className={`status-dot status-${index}`}
                        ></i>

                        {item.name}
                      </span>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* TREND CHART */}

          <div className="analytics-card large">

            <div className="analytics-card-header">
              <div>
                <p>PROCESSING TREND</p>

                <h2>
                  Claims Registered Over Time
                </h2>
              </div>
            </div>

            <div className="chart-container">

              {trendData.length === 0 ? (
                <div className="map-loading">
                  No timeline data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={trendData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1d3927"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#758a7c"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      stroke="#758a7c"
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0b1c12",
                        border:
                          "1px solid #315d3c",
                        borderRadius: "6px",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="claims"
                      stroke="#73c98a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              )}

            </div>

          </div>

          {/* ANOMALY CHART */}

          <div className="analytics-card">

            <div className="analytics-card-header">
              <div>
                <p>AI SIGNAL DISTRIBUTION</p>

                <h2>Anomaly Types</h2>
              </div>
            </div>

            <div className="chart-container anomaly-chart">

              {anomalyData.length === 0 ? (
                <div className="map-loading">
                  No anomaly data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={anomalyData}
                    layout="vertical"
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1d3927"
                    />

                    <XAxis
                      type="number"
                      stroke="#758a7c"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      dataKey="type"
                      type="category"
                      width={100}
                      stroke="#758a7c"
                      tick={{ fontSize: 9 }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0b1c12",
                        border:
                          "1px solid #315d3c",
                        borderRadius: "6px",
                      }}
                    />

                    <Bar
                      dataKey="count"
                      fill="#73c98a"
                      radius={[0, 4, 4, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>

          </div>

        </div>

        {/* NOTE */}

        <div className="analytics-note">

          <strong>
            AI ANALYTICS NOTE
          </strong>

          <p>
            These visualizations represent aggregated
            monitoring data. Anomaly signals are intended
            to support officer review and should not be
            treated as automated legal decisions.
          </p>

        </div>

      </section>
    </main>
  );
}

export default Analytics;