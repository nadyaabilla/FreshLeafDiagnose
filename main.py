from fastapi import FastAPI, APIRouter, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

# Initialize FastAPI app
app = FastAPI()

# Load the trained model (TensorFlow SavedModel format)
MODEL = tf.keras.models.load_model("C:/Users/kinta/Downloads/savedmodels.h5")

# Define class names
CLASS_NAMES = [
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Soybean___healthy',
]

# Define the HelloWorld class
class HelloWorld:
    def read_hello(self):
        return {"data": "Hello World"}

# Define the router for the hello-world API
router = APIRouter()

# Adding the /api/v2/hello-world endpoint
router.add_api_route('/api/v2/hello-world', 
                     endpoint=HelloWorld().read_hello, 
                     methods=["GET"])

# Include the router in the FastAPI application
app.include_router(router)

# Define a simple ping endpoint
@app.get("/ping")
async def ping():
    return "Hello, FreshLeafDiagnoser"

# Function to read and preprocess an image from uploaded data
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data))
    image = image.resize((256, 256))  # Ensure it matches the input size of the model
    return np.array(image)

# Prediction endpoint to make predictions on uploaded images
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    # Preprocess the image: Add batch dimension, normalize, and cast to float32
    img_batch = np.expand_dims(image, axis=0)  # Shape: (1, 256, 256, 3)
    img_batch = img_batch.astype(np.float32) / 255.0  # Normalize to [0, 1]

    # Make predictions using the model
    predictions = MODEL(img_batch)

    # Extract the predicted class and confidence
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

# Run the FastAPI application
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
