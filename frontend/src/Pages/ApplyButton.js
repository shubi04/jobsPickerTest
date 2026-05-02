


import React, { useState } from "react";
import axios from "axios";

const ApplyButton = ({ jobId, onApplied }) => {
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/applyjob/${jobId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted successfully!");
      setShowForm(false);
      if (onApplied) onApplied();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <>
      {!showForm && (
        <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
          Apply
        </button>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="card p-4" style={{ width: "350px", borderRadius: "10px" }}>
            <h4 className="mb-3 text-center">Apply for Job</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Resume URL</label>
                <input
                  type="url"
                  name="resume"
                  className="form-control"
                  value={formData.resume}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>


              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyButton;