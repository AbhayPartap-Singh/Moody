import { useContext } from "react";
import { SongContext } from "../Context/SongContext";
import { getSong } from "../service/song.api";

export const useSong = () => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("useSong must be used within SongProvider");
  }

  const { loading, setLoading, song, setSong, songs, setSongs } = context;

  async function handleGetSongs({ mood }) {
    try {
      setLoading(true);

      const data = await getSong({ mood: mood.toLowerCase() });

      if (data && data.length > 0) {
        setSongs(data);
        setSong(data[0]); // auto play first song
      }

      return data;
    } catch (error) {
      console.error("Song fetch error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    handleGetSongs,
    loading,
    song,
    setSong,
    songs,
  };
};