import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true); // Show loading state
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(data); // Store the entire response (prediction & confidence)
    } catch (error) {
      console.error("Error:", error);
      alert("Error: Failed to get prediction.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="container">
      <h1>Skin Disease Classification</h1>

      <input type="file" onChange={handleFileChange} accept="image/*" />
      
      {/* Show Image Preview */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Uploaded Preview" />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Predict"}
      </button>

      {/* Show Prediction Result */}
      {prediction && (
        <div className="result">
          <h2>Prediction: {prediction.prediction}</h2>
          <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
