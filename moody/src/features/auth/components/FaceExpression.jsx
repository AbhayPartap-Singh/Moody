// src/features/face/FaceExpression.jsx

import { useRef, useState } from "react";
import { initLandmarker } from "../../../utils/initLandmarker";
import { predictEmotionFromBlendshapes } from "../../../utils/blendshapeEmotionModel";
import { stopFaceDetection } from "../../../utils/faceDetectionService";
import { useSong } from "../../home/hooks/useSong";

const emotionToMoodMap = {
  "😊 Happy": "happy",
  "😢 Sad": "sad",
  "😡 Angry": "angry",
  "😠 Angry": "angry",
  "😲 Surprise": "surprise",
  "😐 Neutral": "sad",
  Neutral: "sad",
};

const emotionEmojiMap = {
  "😊 Happy": "😊",
  "😢 Sad": "😢",
  "😡 Angry": "😡",
  "😠 Angry": "😠",
  "😲 Surprise": "😲",
  "😐 Neutral": "😐",
};

export default function FaceExpression() {

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Click Start");
  const [songs, setSongs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const { handleGetSongs, setSong } = useSong();

  const handlePlaySong = (song) => {
    if (!song) return;
    setSong(song);
  };

  const handleStart = async () => {

    if (isRunning) return;

    setIsRunning(true);
    setExpression("Detecting mood...");

    try {

      await initLandmarker({
        landmarkerRef,
        videoRef,
        streamRef,
      });

      const emotionsDetected = [];

      const detectFrame = () => {

        const results = landmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        if (results.faceBlendshapes?.length > 0) {

          const blendshapes = results.faceBlendshapes[0].categories;

          const emotion = predictEmotionFromBlendshapes(blendshapes);

          emotionsDetected.push(emotion);

          setExpression(`Detecting: ${emotion}`);
        }

        animationRef.current = requestAnimationFrame(detectFrame);
      };

      detectFrame();

      setTimeout(async () => {

        stopFaceDetection({
          landmarkerRef,
          videoRef,
          animationRef,
          streamRef,
        });

        setIsRunning(false);

        if (!emotionsDetected.length) {
          setExpression("No face detected");
          return;
        }

        const counts = {};

        emotionsDetected.forEach(e => {
          counts[e] = (counts[e] || 0) + 1;
        });

        const dominantEmotion = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );

        setExpression(`Detected Mood: ${dominantEmotion}`);

        const mood = emotionToMoodMap[dominantEmotion];

        if (!mood) return;

        const fetchedSongs = await handleGetSongs({ mood });

        if (!fetchedSongs?.length) {
          setExpression("No songs found");
          return;
        }

        setSongs(fetchedSongs);

        setSong(fetchedSongs[0]);

      }, 3000);

    } catch (err) {

      console.error(err);
      setExpression("Camera failed");
      setIsRunning(false);

    }
  };

  const currentEmotion = expression.replace("Detected Mood: ", "");
  const emoji = emotionEmojiMap[currentEmotion] || "🙂";

  return (

<div className="dashboard">

  <div className="card mood-card">

    <h3>MOOD</h3>

    <div className="mood-box">

      <div className="emoji">
        {emoji}
      </div>

      <p className="expression">{expression}</p>

    </div>

  </div>

  <div className="card camera-card">

    <h3>Detect your Mood</h3>

    <div className="camera-frame">
      <video ref={videoRef} autoPlay playsInline />
    </div>

    <button
      onClick={handleStart}
      className="scan-btn"
    >
      Start Webcam
    </button>

  </div>

  <div className="card songs-card">

    <h3>Songs for you</h3>

    {songs.map(song => (

      <button
        key={song._id}
        className="song-btn"
        onClick={() => handlePlaySong(song)}
      >
        {song.title}
      </button>

    ))}

  </div>

</div>

);
}