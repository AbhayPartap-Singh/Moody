// src/features/home/components/Player.jsx

import { useRef, useEffect, useState } from "react";
import { useSong } from "../hooks/useSong";

export default function Player() {

  const { song, songs, setSong } = useSong();

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {

    if (!song || !audioRef.current) return;

    audioRef.current.src = song.url;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});

  }, [song]);

  useEffect(() => {

    const updateProgress = () => {

      if (!audioRef.current) return;

      const percent =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;

      setProgress(percent || 0);
    };

    audioRef.current?.addEventListener("timeupdate", updateProgress);

    return () =>
      audioRef.current?.removeEventListener("timeupdate", updateProgress);

  }, []);

  const togglePlay = () => {

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const forward5 = () => {
    audioRef.current.currentTime += 5;
  };

  const backward5 = () => {
    audioRef.current.currentTime -= 5;
  };

  const handleSeek = (e) => {

    const width = e.target.clientWidth;
    const clickX = e.nativeEvent.offsetX;

    const duration = audioRef.current.duration;

    audioRef.current.currentTime = (clickX / width) * duration;
  };

  const changeSpeed = (value) => {

    audioRef.current.playbackRate = value;
    setSpeed(value);
  };

  const handleNextSong = () => {

    if (!songs?.length) return;

    const index = songs.findIndex(s => s._id === song._id);

    const nextSong = songs[(index + 1) % songs.length];

    setSong(nextSong);
  };

  if (!song) {
    return <p>No song selected. Detect your mood first.</p>;
  }

  return (

<div className="player-bar">

  <span className="song-name">
    Now Playing: {song.title}
  </span>

  <audio
    ref={audioRef}
    onEnded={handleNextSong}
  />

  <div
    className="progress-bar"
    onClick={handleSeek}
  >
    <div
      className="progress"
      style={{ width: `${progress}%` }}
    />
  </div>

  <div className="player-controls">

    <button onClick={backward5}>
      ⏪ 5s
    </button>

    <button onClick={togglePlay}>
      {isPlaying ? "Pause" : "Play"}
    </button>

    <button onClick={forward5}>
      5s ⏩
    </button>

    <button onClick={handleNextSong}>
      Next
    </button>

  </div>

  <select
    value={speed}
    onChange={(e) => changeSpeed(e.target.value)}
  >
    <option value="0.5">0.5x</option>
    <option value="1">1x</option>
    <option value="1.5">1.5x</option>
    <option value="2">2x</option>
  </select>

</div>

);
}
