import { Request, Response } from "express";
import { getDistrictDecision } from "../services/decisionService";

export const districtDecision = async (
  req: Request,
  res: Response
) => {
  try {
    const district = req.params.district;

    const decision = await getDistrictDecision(district);

    res.json({
      success: true,
      data: decision,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate decision support",
    });
  }
};
