import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import "../styles/Protected.css";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="protected-container">
      {children}
    </div>
  );
};

export default Protected;