import { generateAlerts } from "../services/alertService";
import { Request, Response } from "express";
import Alert from "../models/Alert";

export const getAlerts = async (
  req: Request,
  res: Response
) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
};

export const markAlertAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update alert",
    });
  }
};
export const generate = async (
  req: Request,
  res: Response
) => {
  try {
    const alerts = await generateAlerts();

    res.json({
      success: true,
      message: "Alerts generated successfully",
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate alerts",
    });
  }
};