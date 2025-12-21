from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# Load your trained Keras model
model = load_model('leaf_disease_model.h5')  # Make sure this file is in the same folder

# Define the class labels predicted by your model
labels = ['Healthy', 'Powdery Mildew', 'Rust', 'Scab']  # Update these as per your model

# Preprocess uploaded image
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).resize((128, 128))  # Resize as per your model input
    img_array = np.array(image) / 255.0                             # Normalize
    return img_array.reshape(1, 128, 128, 3)                        # Batch dimension

# Route to handle prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    image = request.files['image'].read()
    processed = preprocess_image(image)
    prediction = model.predict(processed)[0]
    predicted_label = labels[np.argmax(prediction)]
    return jsonify({'prediction': predicted_label})

# Start Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
