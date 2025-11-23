import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { BASE_URL } from "../../config";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        username,
        password: password.trim(),
      });

      if (res.status === 200) {
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", res.data.role);
        alert(res.data.message);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome to Project Management App</h2>
        <p>
          <span className="highlight">Join us</span> and manage tasks easily.
        </p>
        <div className="logo-box">T</div>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Sign-in</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>
            Don’t have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
