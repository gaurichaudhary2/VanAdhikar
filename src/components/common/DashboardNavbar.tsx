import { useNavigate } from "react-router-dom";

interface DashboardNavbarProps {
  role: "citizen" | "officer";
}

function DashboardNavbar({
  role,
}: DashboardNavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("vanadhikar_token");
    localStorage.removeItem("vanadhikar_user");

    navigate("/");
  };

  const handleMapClick = () => {
    navigate("/officer");

    setTimeout(() => {
      document
        .getElementById("map")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const handleMyClaimClick = () => {
    document
      .querySelector(".claim-search-card")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const handleResourcesClick = () => {
    document
      .getElementById("resources")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-navbar-logo">
        Van<span>Adhikar</span>
      </div>

      <div className="dashboard-navbar-links">

        <button
          onClick={() =>
            navigate(
              role === "officer"
                ? "/officer"
                : "/citizen"
            )
          }
        >
          Dashboard
        </button>

        {role === "officer" ? (
          <>
            <button onClick={handleMapClick}>
              Map
            </button>

            <button
              onClick={() =>
                navigate("/officer/analytics")
              }
            >
              Analytics
            </button>

            <button
              onClick={() =>
                navigate("/officer/reports")
              }
            >
              Reports
            </button>
          </>
        ) : (
          <>
            <button onClick={handleMyClaimClick}>
              My Claim
            </button>

            <button
              onClick={handleResourcesClick}
            >
              Resources
            </button>
          </>
        )}

      </div>

      <button
        className="dashboard-logout"
        onClick={handleLogout}
      >
        Logout
      </button>

    </nav>
  );
}

export default DashboardNavbar;