import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="cta-section" id="about">
      <div className="cta-content">

        <p className="cta-tag">
          THE NEXT STEP
        </p>

        <h2>
          Better data.
          <br />
          Better decisions.
        </h2>

        <p>
          VanAdhikar connects Forest Rights data, spatial
          intelligence and explainable AI to help
          decision-makers focus on what needs attention.
        </p>

        <div className="cta-buttons">

          <button
            className="primary-button"
            onClick={() => navigate("/login")}
          >
            Enter VanAdhikar →
          </button>

          <button
            className="secondary-button"
            onClick={handleLearnMore}
          >
            Learn More
          </button>

        </div>

      </div>
    </section>
  );
}

export default CTASection;