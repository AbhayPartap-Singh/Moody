import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  async function handleRegister(username, email, password) {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(email, password) {
    setLoading(true);
    try {
      const response = await login(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleGetMe() {
    setLoading(true);
    try {
      const response = await getMe();
      setUser(response.user);
      return response;
    } catch (error) {
      console.error("GetMe error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await logout();
      setUser(null);
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
};