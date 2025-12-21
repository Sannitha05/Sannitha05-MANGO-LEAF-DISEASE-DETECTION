import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load the trained model
model = load_model("leaf_disease_model.h5")

# Disease class labels
classes = [
    'Anthracnose', 'Bacterial Canker', 'Cutting Weevil', 'Die Back',
    'Gall Midge', 'Healthy', 'Powdery Mildew', 'Sooty Mould'
]

# Descriptions for each disease
descriptions = {
    "Die Back": "High confidence detection of die back disease showing characteristic tip-to-base tissue death progression",
    "Anthracnose": "Dark, sunken spots on mango leaves; often caused by Colletotrichum fungi.",
    "Bacterial Canker": "Irregular, water-soaked lesions that dry and crack; often surrounded by yellow halos.",
    "Cutting Weevil": "Mechanical damage from insect bites; usually sharp and uniform cuts.",
    "Gall Midge": "Swollen or blistered areas caused by larval feeding; common in tender shoots.",
    "Healthy": "No signs of fungal, bacterial or pest-related damage.",
    "Powdery Mildew": "White powdery fungal spots on the surface of leaves and stems.",
    "Sooty Mould": "Blackish fungal growth on leaves due to honeydew excreted by sap-sucking insects."
}

def predict_disease(pil_image):
    # Resize and normalize image
    img = pil_image.resize((224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Model prediction
    prediction = model.predict(img_array)[0]  # shape: (8,)
    prediction = prediction.astype(float)

    predicted_idx = int(np.argmax(prediction))
    predicted_label = classes[predicted_idx]
    confidence_score = round(float(prediction[predicted_idx]) * 100, 1)

    # Format and sort confidence breakdown
    confidence_breakdown = {
        cls: round(float(score) * 100, 1)
        for cls, score in zip(classes, prediction)
    }
    sorted_confidence = dict(sorted(confidence_breakdown.items(), key=lambda x: x[1], reverse=True))

    return {
        "label": predicted_label,
        "confidence": confidence_score,
        "description": descriptions.get(predicted_label, "No description available."),
        "confidence_breakdown": sorted_confidence
    }
