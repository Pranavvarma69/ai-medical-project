import express from "express";
import axios from "axios";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import Scan from "../models/Scan.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post(
  "/predict",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // 🔁 Call FastAPI
      const pythonResponse = await axios.post(
        "http://localhost:8000/predict",
        {
          image_path: `${process.cwd()}/${req.file.path}`
        }
      );
      console.log("PYTHON RESPONSE:", pythonResponse.data);

      const {
        predictedClass,
        predictions,
        confidence,
      } = pythonResponse.data;

      // 🧪 Debug (TEMP — REMOVE LATER)
      console.log("PYTHON RESPONSE:", pythonResponse.data);

      // 💾 Save to DB
      const scan = await Scan.create({
        user: req.userId,          // ✅ FIXED
        imageUrl: req.file.path,     // ✅ MATCH SCHEMA
        predictedClass,
        confidence,
        predictions,
      });

      res.status(200).json({
        message: "Prediction successful",
        scan,
      });
    } catch (error) {
      console.error("FULL ERROR:", error);
      res.status(500).json({
        error: "Prediction failed",
        details: error.message,
      });
    }
  }
);

export default router;