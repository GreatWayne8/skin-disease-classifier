from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import torch
import timm
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model
model_path = "saved_models/skinrash_best_model.pth"
model = timm.create_model("rexnet_150", pretrained=False, num_classes=3)  # Adjust num_classes
model.load_state_dict(torch.load(model_path, map_location="cpu"))
model.eval()

# Define image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Class labels (Update these with actual class names from your training data)
class_labels = ["Dermatitis", "Eczema", "Ringworm"]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Skin Disease Classification API. Use /predict (POST) to classify an image."})

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided. Please upload an image."}), 400
    
    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension
    
    with torch.no_grad():
        outputs = model(image)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        top_class = torch.argmax(probs, dim=1).item()
    
    return jsonify({
        "prediction": class_labels[top_class],
        "confidence": round(probs[0][top_class].item(), 4)
    })

if __name__ == "__main__":
    app.run(debug=True)
