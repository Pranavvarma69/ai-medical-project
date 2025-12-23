from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import cv2
import os
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras import layers, models


app = FastAPI()

# -------------------------
# Load model ONCE
# -------------------------
MODEL_PATH = "model/xray_classifier_b3_3class1.keras"
IMG_SIZE = (300, 300)

NUM_CLASSES = 3

base_model = EfficientNetB3(
    weights=None,
    include_top=False,
    input_shape=(300, 300, 3)
)

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(NUM_CLASSES, activation="softmax")
])

# IMPORTANT: load weights, not model
model.load_weights("models/xray_classifier_b3_3class1.keras")

print("✅ Model rebuilt and weights loaded")

CLASS_NAMES = ["COVID", "Normal", "Viral Pneumonia"]

# -------------------------
# Request body schema
# -------------------------
class PredictRequest(BaseModel):
    image_path: str

# -------------------------
# Prediction endpoint
# -------------------------
@app.post("/predict")
def predict(req: PredictRequest):
    image_path = req.image_path

    if not os.path.exists(image_path):
        return {"error": "Image not found"}

    # Load image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img_norm = img / 255.0
    input_tensor = np.expand_dims(img_norm, axis=0)

    # Predict
    preds = model.predict(input_tensor)[0]
    pred_index = int(np.argmax(preds))
    predicted_class = CLASS_NAMES[pred_index]
    confidence = float(preds[pred_index])

    predictions = {
        CLASS_NAMES[i]: float(preds[i])
        for i in range(len(CLASS_NAMES))
    }

    

    return {
        "predictedClass": predicted_class,
        "confidence": confidence,
        "predictions": predictions,
    }