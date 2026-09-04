import express from "express";

import {
  getAlerts,
  markAlertAsRead,
  generate,
} from "../controllers/alertController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getAlerts);

router.post("/generate", protect, generate);

router.put("/:id/read", protect, markAlertAsRead);

export default router;