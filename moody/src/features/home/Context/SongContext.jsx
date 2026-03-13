import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ songs, setSongs, song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );
};



