import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ScheduleInterviewModal({ show, onClose, applicationId, fetchApplications }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("online");
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/scheduleinterview",
        {
          applicationId,
          date,
          time,
          mode,
          location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Interview scheduled successfully!");
      navigate("/getcandidateinterviews"); // Redirect to interviews page
      fetchApplications(); // Refresh applications
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to schedule interview.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5 className="mb-3">Schedule Interview</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Date:</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Time:</label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Mode:</label>
              <select
                className="form-control"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            {mode === "offline" && (
              <div className="mb-2">
                <label>Location:</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .modal-dialog {
          background: white;
          border-radius: 8px;
          width: 400px;
        }
      `}</style>
    </div>
  );
}

export default ScheduleInterviewModal;