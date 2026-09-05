import { motion } from "framer-motion";

function InteractiveForest() {
  const points = [
    { top: "20%", left: "22%" },
    { top: "30%", left: "55%" },
    { top: "42%", left: "38%" },
    { top: "52%", left: "72%" },
    { top: "64%", left: "48%" },
    { top: "76%", left: "78%" },
    { top: "35%", left: "85%" },
    { top: "58%", left: "88%" },
    { top: "82%", left: "65%" },
  ];

  return (
    <div className="forest-hud-inner">

      <div className="grid-overlay"></div>

      <div className="forest-glow"></div>

      <div className="forest-points">
        {points.map((point, index) => (
          <motion.div
            key={index}
            className="data-point"
            style={{
              top: point.top,
              left: point.left,
            }}
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: index * 0.25,
            }}
          />
        ))}
      </div>

      <div className="map-label label-one">
        FOREST DATA
      </div>

      <div className="map-label label-two">
        CLAIM ACTIVITY
      </div>

      <div className="map-label label-three">
        AI MONITORING
      </div>

    </div>
  );
}

export default InteractiveForest;
