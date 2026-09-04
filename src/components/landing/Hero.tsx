import { useNavigate } from "react-router-dom";
import InteractiveForest from "./InteractiveForest";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-tag">
          FOREST RIGHTS INTELLIGENCE PLATFORM
        </p>

        <h1>
          Van<span>Adhikar</span>
        </h1>

        <p className="hero-description">
          AI-powered decision support for monitoring Forest
          Rights implementation, detecting unusual patterns
          and turning complex data into actionable insight.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-button"
            onClick={() => navigate("/login")}
          >
            Explore the Platform →
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            See How It Works
          </button>

        </div>

      </div>

      <div className="forest-visual">
        <InteractiveForest />
      </div>

    </section>
  );
}

export default Hero;