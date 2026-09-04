import { Request, Response } from "express";
import Claim from "../models/Claim";

// Overall Dashboard
export const getOverview = async (req: Request, res: Response) => {
  try {
    const total = await Claim.countDocuments();

    const approved = await Claim.countDocuments({
      status: "APPROVED",
    });

    const pending = await Claim.countDocuments({
      status: "PENDING",
    });

    const rejected = await Claim.countDocuments({
      status: "REJECTED",
    });

    const underReview = await Claim.countDocuments({
      status: "UNDER_REVIEW",
    });

    const approvalRate =
      total > 0 ? Math.round((approved / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalClaims: total,
        approved,
        pending,
        rejected,
        underReview,
        approvalRate: `${approvalRate}%`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
    });
  }
};


// State-wise Summary
export const getStateSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const summary = await Claim.aggregate([
      {
        $group: {
          _id: "$state",
          totalClaims: { $sum: 1 },

          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
            },
          },

          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
            },
          },

          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          totalClaims: -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch state summary",
    });
  }
};


// District-wise Summary
export const getDistrictSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const summary = await Claim.aggregate([
      {
        $group: {
          _id: {
            state: "$state",
            district: "$district",
          },

          totalClaims: { $sum: 1 },

          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0],
            },
          },

          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          totalClaims: -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch district summary",
    });
  }
};