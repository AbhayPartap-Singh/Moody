import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const getSong = async ({ mood }) => {
  const response = await api.get("/api/songs", { params: { mood } });
  return response.data; // Returns array of songs
};