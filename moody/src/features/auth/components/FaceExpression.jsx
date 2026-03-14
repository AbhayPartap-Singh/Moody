// src/features/face/FaceExpression.jsx

import { useRef, useState } from "react";
import Navbar from "./Navbar";
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

 return (
  <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 gap-8">

    {/* HEADER */}
    <div className="text-center">
      <h1 className="text-3xl font-bold">Moody 🎧</h1>
      <p className="text-gray-400">AI Mood Based Music Player</p>
    </div>


    {/* MAIN SECTION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">

    <div className="camera-card">

      <h2>Camera</h2>

          <div className="camera-frame">
          <video ref={videoRef} autoPlay playsInline />
          </div>

          <button
          onClick={handleStart}
          className="scan-btn"
          >
          Start Mood Scan
          </button>

          </div>


  <div className="mood-card">

<h2>Detected Emotion</h2>

<p className="mood-text">
{expression}
</p>

</div>

    </div>


    {/* SONGS */}
    {songs.length > 0 && (

      <div className="w-full max-w-5xl">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Recommended Songs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {songs.map(song => (

            <div
              key={song._id}
              className="bg-zinc-900 rounded-xl p-5 flex flex-col gap-4 shadow hover:scale-105 transition"
            >

              <div className="song-card">

               <h3>{song.title}</h3>

               <button
               onClick={() => handlePlaySong(song)}
               className="play-btn"
               >
               Play
               </button>

             </div>

            </div>

          ))}

        </div>

      </div>

    )}

  </div>
);
}