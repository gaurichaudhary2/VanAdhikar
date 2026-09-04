import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { getClaims } from "../../services/api";

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

type StatusFilter =
  | "All"
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "UNDER_REVIEW";

function ClaimMap() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getClaims();

        setClaims(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load claim data from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  const filteredClaims = claims.filter((claim) => {
    if (statusFilter === "All") {
      return true;
    }

    return claim.status === statusFilter;
  });

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#73c98a";

      case "PENDING":
        return "#e9a85d";

      case "UNDER_REVIEW":
        return "#d8a0d8";

      case "REJECTED":
        return "#d86b6b";

      default:
        return "#73c98a";
    }
  };

  if (loading) {
    return (
      <div className="claim-map-wrapper">
        <div className="map-loading">
          Loading claim data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="claim-map-wrapper">
        <div className="map-loading">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="claim-map-wrapper">

      {/* FILTERS */}

      <div className="map-filters">

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as StatusFilter
            )
          }
        >
          <option value="All">
            All Claims
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="UNDER_REVIEW">
            Under Review
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>

      </div>


      {/* MAP */}

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {filteredClaims.map((claim) => {

          const markerColor =
            getMarkerColor(claim.status);

          return (
            <CircleMarker
              key={claim._id}
              center={[
                claim.latitude,
                claim.longitude,
              ]}
              radius={8}
              pathOptions={{
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.75,
              }}
            >

              <Popup>

                <div className="map-popup">

                  <strong>
                    {claim.claimId}
                  </strong>

                  <p>
                    Claimant: {claim.claimantName}
                  </p>

                  <p>
                    District: {claim.district}
                  </p>

                  <p>
                    Village: {claim.village}
                  </p>

                  <p>
                    Status:{" "}
                    {claim.status.replace(
                      /_/g,
                      " "
                    )}
                  </p>

                  <p>
                    Area: {claim.area} ha
                  </p>

                  <button
                    className="map-popup-button"
                    onClick={() =>
                      navigate(
                        `/officer/claim/${claim.claimId}`
                      )
                    }
                  >
                    View Claim →
                  </button>

                </div>

              </Popup>

            </CircleMarker>
          );
        })}

      </MapContainer>


      {/* LEGEND */}

      <div className="map-legend">

        <div>
          <span className="legend-dot normal"></span>
          Approved
        </div>

        <div>
          <span className="legend-dot medium"></span>
          Pending
        </div>

        <div>
          <span
            className="legend-dot"
            style={{
              background: "#d8a0d8",
            }}
          ></span>
          Under Review
        </div>

        <div>
          <span className="legend-dot high"></span>
          Rejected
        </div>

      </div>


      {/* RESULT COUNT */}

      <div className="map-result-count">
        {filteredClaims.length} claims shown
      </div>

    </div>
  );
}

export default ClaimMap;