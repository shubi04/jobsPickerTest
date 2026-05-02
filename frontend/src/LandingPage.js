import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #6366f1, #3b82f6, #06b6d4)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-5 text-center"
        style={{
          width: "360px",
          borderRadius: "18px",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <h2 className="fw-bold text-primary mb-3">Welcome 👋</h2>

        <p className="text-muted mb-4">
          Select your role to continue
        </p>

        <div className="d-grid gap-3">
          <Link
            to="/signup"
            className="btn btn-success btn-lg fw-bold"
            style={{ transition: "0.3s" }}
            onMouseOver={(e) => e.currentTarget.classList.add("shadow-lg")}
            onMouseOut={(e) => e.currentTarget.classList.remove("shadow-lg")}
          >
            Job Seeker
          </Link>

          <Link
            to="/employer-signup"
            className="btn btn-primary btn-lg fw-bold"
            style={{ transition: "0.3s" }}
            onMouseOver={(e) => e.currentTarget.classList.add("shadow-lg")}
            onMouseOut={(e) => e.currentTarget.classList.remove("shadow-lg")}
          >
            Employer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;