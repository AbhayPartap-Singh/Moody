// utils/initLandmarker.js
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const initLandmarker = async ({ landmarkerRef, videoRef, streamRef }) => {
  if (!landmarkerRef || !videoRef || !streamRef) {
    throw new Error("Refs must be provided");
  }

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  // Initialize face landmarker
  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  // Get user camera
  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });

  if (!videoRef.current) throw new Error("videoRef.current not found");
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};