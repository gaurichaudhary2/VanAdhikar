import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Van<span>Adhikar</span>
      </div>

      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#impact">Impact</a>
        <a href="#about">About</a>
      </div>

      <button
        className="login-button"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </nav>
  );
}

export default Navbar;