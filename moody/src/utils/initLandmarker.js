import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const initLandmarker = async ({
  landmarkerRef,
  videoRef,
  streamRef,
}) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  streamRef.current = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};