import mongoose, { Schema, Document } from "mongoose";

export interface IAnomaly extends Document {
  claimId: string;
  type: string;
  severity: string;
  description: string;
  riskScore: number;
  detectedAt: Date;
  resolved: boolean;
}

const anomalySchema = new Schema<IAnomaly>(
  {
    claimId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "DELAYED_CLAIM",
        "LAND_MISMATCH",
        "DUPLICATE_CLAIM",
        "UNUSUAL_APPROVAL",
        "GEO_SPATIAL_MISMATCH",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },

    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAnomaly>("Anomaly", anomalySchema);