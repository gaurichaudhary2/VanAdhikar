import express from "express";

import {
  getAnomalies,
  getAnomalyById,
  analyze,
  resolveAnomaly,
} from "../controllers/anomalyController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getAnomalies);

router.get("/:id", protect, getAnomalyById);

router.post("/analyze", protect, analyze);

router.put("/:id/resolve", protect, resolveAnomaly);

export default router;