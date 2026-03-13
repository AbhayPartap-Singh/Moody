// src/features/home/components/Player.jsx

import { useRef, useEffect, useState } from "react";
import { useSong } from "../hooks/useSong";

export default function Player() {

  const { song, songs, setSong } = useSong();

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {

    if (!song || !audioRef.current) return;

    audioRef.current.src = song.url;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});

  }, [song]);

  const togglePlay = () => {

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {

    if (!songs?.length) return;

    const index = songs.findIndex(s => s._id === song._id);

    const nextSong = songs[(index + 1) % songs.length];

    setSong(nextSong);
  };

  if (!song) {
    return (
      <p>No song selected. Detect your mood first.</p>
    );
  }

  return (

    <div className="player">

      <h4>Now Playing: {song.title}</h4>

      <audio
        ref={audioRef}
        onEnded={handleNextSong}
        controls
      />

      <div>

        <button onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={handleNextSong}>
          Next
        </button>

      </div>

    </div>

  );
}
