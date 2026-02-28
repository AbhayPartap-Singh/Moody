export function predictEmotionFromBlendshapes(blendshapes) {
  const get = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const smile = (get("mouthSmileLeft") + get("mouthSmileRight")) / 2;
  const frown = (get("mouthFrownLeft") + get("mouthFrownRight")) / 2;
  const jawOpen = get("jawOpen");
  const browUp = get("browInnerUp");
  const browDown =
    (get("browDownLeft") + get("browDownRight")) / 2;
  const eyeWide =
    (get("eyeWideLeft") + get("eyeWideRight")) / 2;

  let scores = {
    happy: smile * 2,
    sad: frown * 2 + browUp,
    angry: browDown * 2,
    surprise: jawOpen * 2 + eyeWide,
  };

  const best = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  if (scores[best] < 0.5) return "😐 Neutral";

  switch (best) {
    case "happy":
      return "😊 Happy";
    case "sad":
      return "😢 Sad";
    case "angry":
      return "😠 Angry";
    case "surprise":
      return "😲 Surprise";
    default:
      return "😐 Neutral";
  }
}