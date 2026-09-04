import express from "express";

import {
  getOverview,
  getStateSummary,
  getDistrictSummary,
} from "../controllers/dashboardController";

const router = express.Router();

router.get("/overview", getOverview);
router.get("/state-summary", getStateSummary);
router.get("/district-summary", getDistrictSummary);

export default router;