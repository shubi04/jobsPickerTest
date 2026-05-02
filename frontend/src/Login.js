

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ If already logged in → go to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email & password ❌");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ If OTP required, redirect to VerifyOtp page
      if (res.data.otpRequired) {
        navigate("/verifyotp", { state: { email } });
        return;
      }

      // ✅ Login successful → save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);

      // ✅ Redirect based on role
      if (res.data.user.role === "employer") {
        navigate("/employer-profile");
      } else {
        navigate("/jobseeker-profile");
      }

    } catch (err) {
      console.log("ERROR:", err.response);

      if (err.response?.status === 403) {
        alert("Please verify your email first ❌");
        navigate("/verifyotp", { state: { email } });
      } else {
        alert(err.response?.data?.message || "Login failed ❌");
      }
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center vh-100"
         style={{ background: "linear-gradient(135deg, #64b5f6, #ec407a)" }}>

      <form onSubmit={handleLogin} className="login-form p-4 shadow rounded"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", width: "360px", color: "#fff" }}>

        <h2 className="text-center mb-3">Welcome Back 👋</h2>
        <p className="text-center small mb-4">Login to continue</p>

        <select className="form-select mb-3" onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-success w-100 mb-2">
          Login
        </button>

        <p className="text-center mt-3">
          Don't Have an account?{" "}
          <span
            onClick={() => navigate(role === "employer" ? "/employer-signup" : "/signup")}
            style={{ color: "#ec407a", cursor: "pointer", fontWeight: "600" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;