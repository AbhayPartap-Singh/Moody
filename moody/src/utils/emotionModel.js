export async function predictEmotion(coords) {
  // Convert flat array back to landmark objects
  const landmarks = [];
  for (let i = 0; i < coords.length; i += 3) {
    landmarks.push({
      x: coords[i],
      y: coords[i + 1],
      z: coords[i + 2],
    });
  }

  // Key points
  const topLip = landmarks[13];
  const bottomLip = landmarks[14];
  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];

  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];

  const leftBrow = landmarks[70];
  const leftEye = landmarks[33];

  // Measurements
  const mouthOpen = Math.abs(topLip.y - bottomLip.y);
  const mouthWidth = Math.abs(leftMouth.x - rightMouth.x);
  const eyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
  const browDistance = Math.abs(leftBrow.y - leftEye.y);

  // Emotion Logic

  // 😲 Surprise → mouth open + eyes wide
  if (mouthOpen > 0.04 && eyeOpen > 0.03) {
    return "😲 Surprise";
  }

  // 😊 Happy → wide mouth but not too open
  if (mouthWidth > 0.25 && mouthOpen < 0.03) {
    return "😊 Happy";
  }

  // 😠 Angry → eyebrows close to eyes
  if (browDistance < 0.02) {
    return "😠 Angry";
  }

  // 😕 Confused → slightly raised brow + small mouth movement
  if (browDistance > 0.035 && mouthOpen < 0.025) {
    return "😕 Confused";
  }

  return "😐 Neutral";
}