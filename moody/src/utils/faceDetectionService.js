// utils/faceDetectionService.js
export const startFaceDetection = async ({
  landmarkerRef,
  videoRef,
  streamRef,
  animationRef,
  initLandmarker,
  predictEmotionFromBlendshapes,
  onEmotionDetected, // callback for each frame
}) => {
  await initLandmarker({ landmarkerRef, videoRef, streamRef });

  const detectFrame = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;
      const emotion = predictEmotionFromBlendshapes(blendshapes);

      if (onEmotionDetected) onEmotionDetected(emotion);
    } else if (onEmotionDetected) {
      onEmotionDetected("No Face Detected");
    }

    animationRef.current = requestAnimationFrame(detectFrame);
  };

  detectFrame();
};

export const stopFaceDetection = ({ landmarkerRef, videoRef, animationRef, streamRef }) => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);

  if (landmarkerRef.current) landmarkerRef.current.close();

  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  }

  if (streamRef?.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
  }
};