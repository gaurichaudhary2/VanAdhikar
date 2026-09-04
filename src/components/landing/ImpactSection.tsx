function ImpactSection() {
  return (
    <section className="impact-section" id="impact">
      <div className="impact-content">
        <p className="impact-tag">WHY VANADHIKAR</p>

        <h2>
          From scattered data
          <br />
          to <span>actionable intelligence.</span>
        </h2>

        <p className="impact-description">
          Forest Rights implementation involves claims, land records,
          geographic information and administrative workflows.
          VanAdhikar brings these signals together so officials can
          identify where attention is needed and why.
        </p>
      </div>

      <div className="impact-stats">
        <div className="stat-card">
          <strong>01</strong>
          <span>Spatial Intelligence</span>
          <p>Map claims, forests and land relationships.</p>
        </div>

        <div className="stat-card">
          <strong>02</strong>
          <span>AI Anomaly Detection</span>
          <p>Surface unusual patterns and potential bottlenecks.</p>
        </div>

        <div className="stat-card">
          <strong>03</strong>
          <span>Explainable Insights</span>
          <p>Show why an issue was flagged.</p>
        </div>

        <div className="stat-card">
          <strong>04</strong>
          <span>Decision Support</span>
          <p>Turn evidence into recommended next actions.</p>
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;