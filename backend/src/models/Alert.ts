import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  title: string;
  message: string;
  severity: string;
  claimId?: string;
  read: boolean;
}

const alertSchema = new Schema<IAlert>(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    claimId: {
      type: String,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>("Alert", alertSchema);