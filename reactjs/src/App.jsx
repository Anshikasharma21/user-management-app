import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/create", form);

      toast.success(res.data.message || "User created successfully 🎉");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>User Registration</h1>
        <p>Create your account...</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* hidden fake inputs to block browser autofill */}
          <input type="text" name="fakeuser" autoComplete="off" style={{ display: "none" }} />
          <input type="password" name="fakepass" autoComplete="off" style={{ display: "none" }} />

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />

          <input
            type="text"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="black"
      />
    </div>
  );
}

export default App;
