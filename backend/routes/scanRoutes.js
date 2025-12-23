import express from 'express';
import axios from 'axios';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';
import Scan from '../models/Scan.js';

const router = express.Router();

const upload=multer({
    dest:'uploads/',
});

router.post("/predict",protect,upload.single('image'),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message:"No File Uploaded"});
        }
        const pythonResponse=await axios.post("http://localhost:8000/predict",{
            image_path:req.file.path,
        });
        const{predictedClass,predictions,
            confidence,
            gradcamPath,}=pythonResponse.data;
        const scan=await Scan.create({
            user:req.userId,
            imageUrl:req.file.path,
            gradcamUrl: gradcamPath,
            predictions,
            predictedClass,
            confidence,
        });
        res.status(200).json({
            message:"prediction successfull",
            scan,
        });
    

    }catch(error){
        console.error("Prediction error:", error.message);
        res.status(500).json({ error: "Prediction failed" });
    }
});
export default router;
