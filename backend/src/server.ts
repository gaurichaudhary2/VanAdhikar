import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import claimRoutes from "./routes/claimRoutes";
import anomalyRoutes from "./routes/anomalyRoutes";
import alertRoutes from "./routes/alertRoutes";
import decisionRoutes from "./routes/decisionRoutes";
import {
  register,
  login,
} from "./controllers/authController";

dotenv.config();

console.log("AUTH:", authRoutes);
console.log("CLAIMS:", claimRoutes);
console.log("DASHBOARD:", dashboardRoutes);
console.log("ANOMALIES:", anomalyRoutes);
console.log("ALERTS:", alertRoutes);
console.log("DECISION:", decisionRoutes);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.use("/api/claims", claimRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/anomalies", anomalyRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/decision-support", decisionRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VanAdhikar Backend is running!"
  });
});

// Server
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});