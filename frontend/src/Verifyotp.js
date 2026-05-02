import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/verifyotp", {
        email,
        otp,
      });

      alert("OTP Verified ✅");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP ❌");
    }

    setLoading(false);
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/sendotp", { email });
      alert("OTP Resent 📩");
    } catch {
      alert("Failed to resend OTP ❌");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-dark">

      <div className="card shadow-lg p-4 text-center text-white"
        style={{
          width: "380px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)"
        }}>

        <h2 className="fw-bold">Verify OTP</h2>

        <p className="text-light small">
          Enter OTP sent to <br />
          <span className="text-info">{email}</span>
        </p>

        <input
          className="form-control text-center mb-3"
          style={{
            letterSpacing: "5px",
            fontSize: "18px"
          }}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="btn btn-success w-100 mb-2"
          onClick={handleVerify}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          className="btn btn-secondary w-100"
          onClick={handleResend}
        >
          Resend OTP
        </button>

      </div>
    </div>
  );
};

export default VerifyOtp;