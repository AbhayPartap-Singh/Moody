// utils/faceDetectionService.js

export async function startFaceDetection({
  landmarkerRef,
  videoRef,
  streamRef,
  setExpression,
  animationRef,
  initLandmarker,
  predictEmotionFromBlendshapes,
}) {
  await initLandmarker({
    landmarkerRef,
    videoRef,
    streamRef,
  });

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
}

export function stopFaceDetection({
  landmarkerRef,
  videoRef,
  animationRef,
}) {
  if (animationRef.current)
    cancelAnimationFrame(animationRef.current);

  if (landmarkerRef.current)
    landmarkerRef.current.close();

  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
  }
}