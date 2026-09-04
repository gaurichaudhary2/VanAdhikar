import express from "express";
import {
  getClaims,
  getClaimById,
  createClaim,
} from "../controllers/claimController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getClaims);

router.get("/:id", protect, getClaimById);

router.post("/", protect, createClaim);

export default router;