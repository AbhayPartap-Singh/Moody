import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { predictEmotion } from "../utils/emotionModel";

export default function EmotionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
    setLoading(false);

    async function onResults(results) {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(0, 0, 640, 480);
      canvasCtx.drawImage(results.image, 0, 0, 640, 480);

      if (results.multiFaceLandmarks?.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const coords = landmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

        const predictedEmotion = await predictEmotion(coords);
        setEmotion(predictedEmotion);
      } else {
        setEmotion("No Face Detected");
      }
    }
  }, []);

  return (
    <div className="card">
      <h2 className="emotion-text">{emotion}</h2>

      {loading && <p>Starting camera...</p>}

      <div className="video-container">
        <video ref={videoRef} className="hidden-video" />
        <canvas ref={canvasRef} width="640" height="480" />
      </div>
    </div>
  );
}