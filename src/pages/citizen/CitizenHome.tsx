import { useState } from "react";
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
}

function CitizenHome() {
  const [claimId, setClaimId] = useState("");
  const [searchedClaim, setSearchedClaim] =
    useState<Claim | null>(null);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!claimId.trim()) {
      setError("Please enter your Claim ID.");
      setSearched(false);
      setSearchedClaim(null);
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);
    setSearchedClaim(null);

    try {
      const result = await getClaimById(claimId.trim());

      if (result) {
        setSearchedClaim(result);
        setSearched(true);
      } else {
        setError(
          "No claim found with this ID. Please check the ID and try again."
        );
        setSearched(true);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the VanAdhikar server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const getRiskReview = (claim: Claim) => {
    if (claim.area > claim.landRecordArea) {
      return "Additional Review";
    }

    return "Standard Review";
  };

  return (
    <main className="citizen-page">
      <DashboardNavbar role="citizen" />

      <section className="citizen-content">

        {/* HEADER */}

        <div className="citizen-header">
          <p className="dashboard-tag">
            CITIZEN PORTAL
          </p>

          <h1>Track Your Claim</h1>

          <p>
            Check the current status of your Forest Rights claim
            and understand what happens next.
          </p>
        </div>


        {/* SEARCH */}

        <div className="claim-search-card">

          <p className="detail-label">
            CLAIM STATUS TRACKER
          </p>

          <h2>Enter your Claim ID</h2>

          <p>
            Use the Claim ID provided during registration to view
            your application status.
          </p>

          <div className="claim-search">

            <input
              type="text"
              placeholder="Example: FRA-JH-001"
              value={claimId}
              onChange={(e) => {
                setClaimId(e.target.value);
                setSearched(false);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Checking..." : "Track Claim →"}
            </button>

          </div>


          {/* ERROR */}

          {error && (
            <div className="claim-error">
              {error}
            </div>
          )}

        </div>


        {/* CLAIM RESULT */}

        {searched && searchedClaim && (

          <div className="claim-result">

            {/* RESULT HEADER */}

            <div className="claim-result-header">

              <div>

                <p className="detail-label">
                  CLAIM FOUND
                </p>

                <h2>
                  {searchedClaim.claimId}
                </h2>

                <p>
                  {searchedClaim.district} District ·{" "}
                  {searchedClaim.state}
                </p>

              </div>

              <span
                className={`citizen-status ${searchedClaim.status
                  .toLowerCase()
                  .replace(/_/g, "-")}`}
              >
                {getStatusLabel(searchedClaim.status)}
              </span>

            </div>


            {/* CLAIMANT */}

            <div className="citizen-summary-grid">

              <div>
                <span>CLAIMANT</span>

                <strong>
                  {searchedClaim.claimantName}
                </strong>
              </div>


              <div>
                <span>VILLAGE</span>

                <strong>
                  {searchedClaim.village}
                </strong>
              </div>


              <div>
                <span>CLAIM TYPE</span>

                <strong>
                  {searchedClaim.claimType}
                </strong>
              </div>

            </div>


            {/* CLAIM DETAILS */}

            <div className="citizen-summary-grid">

              <div>
                <span>CLAIMED AREA</span>

                <strong>
                  {searchedClaim.area} ha
                </strong>
              </div>


              <div>
                <span>LAND RECORD AREA</span>

                <strong>
                  {searchedClaim.landRecordArea} ha
                </strong>
              </div>


              <div>
                <span>REVIEW</span>

                <strong>
                  {getRiskReview(searchedClaim)}
                </strong>
              </div>

            </div>


            {/* TIMELINE */}

            <div className="citizen-timeline">

              <p className="detail-label">
                APPLICATION PROGRESS
              </p>


              <div className="citizen-step completed">

                <span></span>

                <div>
                  <strong>
                    Claim Submitted
                  </strong>

                  <p>
                    Your application was registered on{" "}
                    {new Date(
                      searchedClaim.submittedDate
                    ).toLocaleDateString()}
                    .
                  </p>
                </div>

              </div>


              <div className="citizen-step completed">

                <span></span>

                <div>
                  <strong>
                    Initial Verification
                  </strong>

                  <p>
                    The submitted information has entered
                    the verification process.
                  </p>
                </div>

              </div>


              <div className="citizen-step active">

                <span></span>

                <div>
                  <strong>
                    Current Status
                  </strong>

                  <p>
                    Your claim is currently marked as{" "}
                    <b>
                      {getStatusLabel(
                        searchedClaim.status
                      )}
                    </b>
                    .
                  </p>
                </div>

              </div>


              <div className="citizen-step">

                <span></span>

                <div>
                  <strong>
                    Final Decision
                  </strong>

                  <p>
                    The claim will proceed through the
                    applicable review process.
                  </p>
                </div>

              </div>

            </div>


            {/* NEXT STEPS */}

            <div className="citizen-next">

              <p className="detail-label">
                WHAT HAPPENS NEXT?
              </p>

              <h2>
                Keep your supporting documents ready
              </h2>

              <p>
                If additional verification is required,
                the relevant authorities may request
                supporting records or conduct further
                field verification.
              </p>

            </div>

          </div>

        )}


        {/* INFORMATION CARDS */}

        {!searchedClaim && (

          <div className="citizen-info-grid">

            <div className="citizen-info-card">

              <span>01</span>

              <h3>
                Track your claim
              </h3>

              <p>
                Enter your Claim ID to view the latest
                available status of your application.
              </p>

            </div>


            <div className="citizen-info-card">

              <span>02</span>

              <h3>
                Understand the process
              </h3>

              <p>
                Follow the stages of verification and
                review without having to decipher
                bureaucratic hieroglyphics.
              </p>

            </div>


            <div className="citizen-info-card">

              <span>03</span>

              <h3>
                Know your next step
              </h3>

              <p>
                Get clear information about what may
                happen next in the claim process.
              </p>

            </div>

          </div>

        )}


        {/* CITIZEN RESOURCES */}

        <section
          className="citizen-resources"
          id="resources"
        >

          <div>

            <p className="detail-label">
              CITIZEN RESOURCES
            </p>

            <h2>
              Understanding your Forest Rights claim
            </h2>

            <p>
              Access information about claim verification,
              supporting documentation and the Forest
              Rights process.
            </p>

          </div>


          <div className="resource-list">

            <div>

              <span>01</span>

              <strong>
                Claim Documentation
              </strong>

              <p>
                Keep relevant documents and evidence ready
                for verification.
              </p>

            </div>


            <div>

              <span>02</span>

              <strong>
                Claim Verification
              </strong>

              <p>
                Understand the stages involved in reviewing
                your application.
              </p>

            </div>


            <div>

              <span>03</span>

              <strong>
                Know Your Status
              </strong>

              <p>
                Use your Claim ID to check the latest
                available status of your application.
              </p>

            </div>

          </div>

        </section>

      </section>
    </main>
  );
}

export default CitizenHome;