import React, { useState } from "react";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Skin Disease Classifier</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload and Predict"}
      </button>

      {prediction && (
        <div>
          <h3>Prediction Result</h3>
          <p><strong>Disease:</strong> {prediction.prediction}</p>
          <p><strong>Confidence:</strong> {Math.round(prediction.confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
