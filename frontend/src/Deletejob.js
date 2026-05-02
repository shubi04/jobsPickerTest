import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DeleteJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deletejob/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job deleted successfully");

      navigate("/jobs"); // back to jobs list

    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Are you sure you want to delete this job?</h2>

      <button
        onClick={handleDelete}
        style={{
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          marginRight: "10px",
          cursor: "pointer"
        }}
      >
        Yes, Delete
      </button>

      <button
        onClick={() => navigate("/jobs")}
        style={{
          padding: "10px 20px",
          backgroundColor: "gray",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default DeleteJob;