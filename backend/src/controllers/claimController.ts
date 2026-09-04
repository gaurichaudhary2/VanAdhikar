import { Request, Response } from "express";
import Claim from "../models/Claim";

// Get all claims
export const getClaims = async (req: Request, res: Response) => {
  try {
    const { state, district, status } = req.query;

    const filter: any = {};

    if (state) {
      filter.state = state;
    }

    if (district) {
      filter.district = district;
    }

    if (status) {
      filter.status = status;
    }

    const claims = await Claim.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch claims",
    });
  }
};


// Get single claim
export const getClaimById = async (
  req: Request,
  res: Response
) => {
  try {
    const claim = await Claim.findOne({
      claimId: req.params.id,
    });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    res.json({
      success: true,
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch claim",
    });
  }
};


// Create new claim
export const createClaim = async (
  req: Request,
  res: Response
) => {
  try {
    const claim = await Claim.create(req.body);

    res.status(201).json({
      success: true,
      message: "Claim created successfully",
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create claim",
    });
  }
};