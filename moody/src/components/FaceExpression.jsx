import { useRef, useState } from "react";
import { initLandmarker } from "../utils/initLandmarker";
import { predictEmotionFromBlendshapes } from "../utils/blendshapeEmotionModel";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Click Start");
  const [isRunning, setIsRunning] = useState(false);

  const startCamera = async () => {
    if (isRunning) return;

    await initLandmarker({
      landmarkerRef,
      videoRef,
      streamRef,
    });

    setIsRunning(true);
    setExpression("Detecting...");

    detectLoop();
  };

  const detectLoop = () => {
    const detectFrame = () => {
      if (!landmarkerRef.current || !videoRef.current) return;

      const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (results.faceBlendshapes?.length > 0) {
        const blendshapes =
          results.faceBlendshapes[0].categories;

        const emotion =
          predictEmotionFromBlendshapes(blendshapes);

        setExpression(emotion);
      } else {
        setExpression("No Face Detected");
      }

      animationRef.current =
        requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  const stopCamera = () => {
    if (animationRef.current)
      cancelAnimationFrame(animationRef.current);

    if (landmarkerRef.current)
      landmarkerRef.current.close();

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsRunning(false);
    setExpression("Camera Stopped");
  };

  return (
    <div className="card">
      <h2 className="emotion-text">{expression}</h2>

      <div style={{ marginBottom: "15px" }}>
        {!isRunning ? (
          <button onClick={startCamera}>
            Start Camera
          </button>
        ) : (
          <button onClick={stopCamera}>
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