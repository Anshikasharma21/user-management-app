import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // keep frontend validation (IMPORTANT)
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://user-management-app-072j.onrender.com/api/create",
        {
          username: form.username,
          email: form.email,
          password: form.password,
        }
      );

      setMessage(res.data.message);

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      if (res.data.message === "🎉 User created successfully!") {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Register</h1>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;