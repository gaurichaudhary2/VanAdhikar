import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function LoginPage() {
  const [role, setRole] =
    useState<"citizen" | "officer">("citizen");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your credentials.");
      return;
    }

    setLoading(true);

    // Demo login for Citizen
    if (role === "citizen") {
      localStorage.setItem(
        "vanadhikar_user",
        JSON.stringify({
          name: "Demo Citizen",
          email: email.trim(),
          role: "CITIZEN",
        })
      );

      localStorage.setItem(
        "vanadhikar_token",
        "citizen-demo-token"
      );

      navigate("/citizen");
      setLoading(false);
      return;
    }

    // Real backend login for Officer
    try {
      const data = await loginUser(
        email.trim(),
        password
      );

      const userRole = data.user?.role;

      localStorage.setItem(
        "vanadhikar_token",
        data.token
      );

      localStorage.setItem(
        "vanadhikar_user",
        JSON.stringify(data.user)
      );

      if (
        userRole === "DISTRICT_OFFICER" ||
        userRole === "STATE_OFFICER" ||
        userRole === "ADMIN"
      ) {
        navigate("/officer");
      } else {
        navigate("/citizen");
      }
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to connect to the VanAdhikar server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-logo">
          Van<span>Adhikar</span>
        </div>

        <p className="login-tag">
          FOREST RIGHTS INTELLIGENCE PLATFORM
        </p>

        <h1>Welcome back</h1>

        <p className="login-description">
          Sign in to access the VanAdhikar platform.
        </p>

        <div className="role-selector">

          <button
            className={
              role === "citizen"
                ? "role-card active"
                : "role-card"
            }
            onClick={() => {
              setRole("citizen");
              setError("");
            }}
            type="button"
          >
            <span className="role-icon">
              ◉
            </span>

            <div>
              <strong>Citizen</strong>

              <p>
                Track your Forest Rights claim
              </p>
            </div>
          </button>

          <button
            className={
              role === "officer"
                ? "role-card active"
                : "role-card"
            }
            onClick={() => {
              setRole("officer");
              setError("");
            }}
            type="button"
          >
            <span className="role-icon">
              ◆
            </span>

            <div>
              <strong>Officer</strong>

              <p>
                Access the decision support dashboard
              </p>
            </div>
          </button>

        </div>

        <div className="login-form">

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder={
              role === "officer"
                ? "Officer email"
                : "Citizen email"
            }
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
          />

        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <button
          className="login-continue"
          onClick={handleContinue}
          disabled={loading}
          type="button"
        >
          {loading
            ? "Signing In..."
            : `Sign In as ${
                role === "citizen"
                  ? "Citizen"
                  : "Officer"
              }`}
        </button>

        <p className="login-demo">
          Authentication is securely handled by the
          VanAdhikar backend.
        </p>

      </div>
    </main>
  );
}

export default LoginPage;