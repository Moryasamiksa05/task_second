import "./ImageUploader.css";
import { useRef, useState, useEffect } from "react";

const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  const [previews, setPreviews] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Failed to access camera: " + err.message);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      closeCamera();
    }
  };

  const confirmCapture = () => {
    setPreviews((prev) => [...prev, capturedImage]);
    setCapturedImage(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    openCamera();
  };

  const handleUpload = () => {
    if (previews.length > 0) {
      onUpload(previews);
      setPreviews([]);
    }
  };

  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);

  return (
    <div className="uploader">
      <h2>Upload or Take Image</h2>
      <div className="upload-box" onClick={() => fileInputRef.current.click()}>
        <p>Click to select images</p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleSelect}
          style={{ display: "none" }}
        />
      </div>

      {!showCamera && !capturedImage && (
        <button onClick={openCamera}>Take Photo</button>
      )}

      {showCamera && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={handleCapture}>Capture</button>
          <button onClick={closeCamera}>Cancel</button>
        </div>
      )}

      {capturedImage && (
        <div className="capture-preview">
          <img src={capturedImage} alt="Captured" />
          <button onClick={confirmCapture}>Use Photo</button>
          <button onClick={retakePhoto}>Retake</button>
        </div>
      )}

      {previews.length > 0 && (
        <>
          <div className="preview-grid">
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="preview"
              />
            ))}
          </div>
          <button onClick={handleUpload}>Upload All</button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageUploader;
