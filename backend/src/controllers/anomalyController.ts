import { Request, Response } from "express";
import Anomaly from "../models/Anomaly";
import { analyzeClaims } from "../services/anomalyService";

// Get all anomalies
export const getAnomalies = async (req: Request, res: Response) => {
  try {
    const anomalies = await Anomaly.find()
      .sort({ riskScore: -1, createdAt: -1 });

    res.json({
      success: true,
      count: anomalies.length,
      anomalies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch anomalies",
    });
  }
};


// Get anomaly by ID
export const getAnomalyById = async (
  req: Request,
  res: Response
) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id);

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found",
      });
    }

    res.json({
      success: true,
      anomaly,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch anomaly",
    });
  }
};


// Run AI anomaly analysis
export const analyze = async (
  req: Request,
  res: Response
) => {
  try {
    const anomalies = await analyzeClaims();

    res.json({
      success: true,
      message: "Anomaly analysis completed successfully",
      count: anomalies.length,
      anomalies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Anomaly analysis failed",
    });
  }
};


// Resolve anomaly
export const resolveAnomaly = async (
  req: Request,
  res: Response
) => {
  try {
    const anomaly = await Anomaly.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found",
      });
    }

    res.json({
      success: true,
      message: "Anomaly resolved successfully",
      anomaly,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resolve anomaly",
    });
  }
};