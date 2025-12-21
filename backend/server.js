import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

app.use(cors());                 
app.use(express.json());         


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(2000, () => {
      console.log("Server running on port 2000");
    });
  })
  .catch((err) => {
    console.error("DB error:", err);
  });