import express from "express";

import { districtDecision } from "../controllers/decisionController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/district/:district",
  protect,
  districtDecision
);

export default router;