import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);

      if (res.data && res.data.message) {
        setMessage(res.data.message);
        alert(res.data.message);
      } else {
        setMessage("Login successful!");
      }

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setForm({ email: "", password: "" });

      navigate("/Dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Invalid email or password");
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Fake inputs to block autofill */}
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <input
            type="text"
            name="email"
            placeholder="Username"
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

          <button type="submit">Log In</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Login;