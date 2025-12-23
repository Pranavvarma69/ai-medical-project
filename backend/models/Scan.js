import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    gradcamUrl: {
      type: String,
      required: true
    },
    predictions: {
      type: Map,
      of: Number, 
      required: true
    },
    predictedClass: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);