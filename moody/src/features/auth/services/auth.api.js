import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
})

export async function register(username, email, password) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me")   // ✅ fixed
    return response.data
  } catch (error) {
    throw error
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout")
    return response.data
  } catch (error) {
    throw error
  }    
}