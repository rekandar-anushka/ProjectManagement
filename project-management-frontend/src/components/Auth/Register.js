import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", form);

      if (res.status === 201) {
        alert("Registration successful!");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data);
      } else {
        setError("Failed to register. Please try again.");
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
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
            </select>
            <button type="submit">Register</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
