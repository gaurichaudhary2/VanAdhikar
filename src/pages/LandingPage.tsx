import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import ImpactSection from "../components/landing/ImpactSection";
import CTASection from "../components/landing/CTASection";

function LandingPage() {
  return (
    <main>

      <Navbar />

      <Hero />

      <HowItWorks />

      <ImpactSection />

      <section className="about-section" id="about">

        <div className="about-content">

          <p className="hero-tag">
            ABOUT VANADHIKAR
          </p>

          <h2>
            Technology for better
            <span> forest governance.</span>
          </h2>

          <p>
            VanAdhikar is a decision-support platform designed
            to help authorities monitor Forest Rights
            implementation through structured data,
            spatial intelligence and explainable AI signals.
          </p>

          <p>
            The system does not replace legal or administrative
            decision-making. Instead, it helps identify where
            attention may be needed so that officers can review
            the underlying evidence and act more efficiently.
          </p>

        </div>

      </section>

      <CTASection />

    </main>
  );
}

export default LandingPage;