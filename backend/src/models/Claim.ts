import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
  claimId: string;
  claimantName: string;
  state: string;
  district: string;
  village: string;

  claimType: string;
  status: string;

  area: number;

  latitude: number;
  longitude: number;

  submittedDate: Date;
  decisionDate?: Date;

  landRecordArea?: number;
}

const claimSchema = new Schema<IClaim>(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
    },

    claimantName: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    claimType: {
      type: String,
      enum: [
        "IFR",
        "CFR",
        "CR",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "UNDER_REVIEW",
      ],
      default: "PENDING",
    },

    area: {
      type: Number,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    submittedDate: {
      type: Date,
      required: true,
    },

    decisionDate: {
      type: Date,
    },

    landRecordArea: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClaim>("Claim", claimSchema);