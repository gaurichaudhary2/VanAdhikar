import { motion } from "framer-motion";

function InteractiveForest() {
  const points = [
    { top: "18%", left: "65%" },
    { top: "30%", left: "78%" },
    { top: "43%", left: "60%" },
    { top: "52%", left: "73%" },
    { top: "65%", left: "57%" },
    { top: "74%", left: "76%" },
    { top: "35%", left: "88%" },
    { top: "58%", left: "89%" },
    { top: "82%", left: "67%" },
  ];

  return (
    <div className="forest-visual">
      <div className="grid-overlay"></div>

      <div className="forest-glow"></div>

      {points.map((point, index) => (
        <motion.div
          key={index}
          className="data-point"
          style={{
            top: point.top,
            left: point.left,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.25,
          }}
        />
      ))}

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