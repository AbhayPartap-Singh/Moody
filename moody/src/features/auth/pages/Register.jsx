import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/form.scss";
import Navbar from "../components/Navbar";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await handleRegister(username, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="form-container">
      <Navbar />

      <h1 className="heading">Register</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Registering..." : "Submit"}
        </button>

      </form>

      <p>
        Already have an account: <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
