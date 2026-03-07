import { useRef, useState } from "react";
import { initLandmarker } from "../../../utils/initLandmarker";
import { predictEmotionFromBlendshapes } from "../../../utils/blendshapeEmotionModel";
import Navbar from "./Navbar";
import {
  startFaceDetection,
  stopFaceDetection,
} from "../../../utils/faceDetectionService";


export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Click Start");
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExpression("Detecting...");

    await startFaceDetection({
      landmarkerRef,
      videoRef,
      streamRef,
      setExpression,
      animationRef,
      initLandmarker,
      predictEmotionFromBlendshapes,
    });
  };

  const handleStop = () => {
    stopFaceDetection({
      landmarkerRef,
      videoRef,
      animationRef,
    });

    setIsRunning(false);
    setExpression("Camera Stopped");
  };

  return (
    <div className="card">
      <Navbar/>
      <h2 className="emotion-text">{expression}</h2>

      <div style={{ marginBottom: "15px" }}>
        {!isRunning ? (
          <button onClick={handleStart}>
            Start Camera
          </button>
        ) : (
          <button onClick={handleStop}>
            Stop Camera
          </button>
        )}
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          width="940"
          height="350"
          autoPlay
          playsInline
          style={{
            borderRadius: "15px",
            border: "3px solid #f50072",
          }}
        />
      </div>
    </div>
  );
}