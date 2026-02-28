import { predictEmotionFromBlendshapes } from "./blendshapeEmotionModel";

export const detectEmotion = ({
  landmarkerRef,
  videoRef,
  setExpression,
}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;
    const emotion = predictEmotionFromBlendshapes(blendshapes);
    setExpression(emotion);
  } else {
    setExpression("No Face Detected");
  }
};