import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Review = () => {
    const navigate=useNavigate()
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const location = useLocation();
  const companyId = location.state?.companyId;

  const token = localStorage.getItem("token");

  const submitReview = async () => {
    if (!companyId) {
  return (
    <div className="text-center mt-5">
      <h3>⚠️ Please go from Applications page</h3>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/myapplications")}
      >
        Go Back
      </button>
    </div>
  );
}

    try {
      const res = await axios.post(
        "http://localhost:5000/api/addreview",
        {
          companyId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">

        <h3 className="text-center mb-3">⭐ Give Review</h3>

        {/* ⭐ Stars */}
        <div className="text-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: "30px",
                cursor: "pointer",
                color: star <= rating ? "gold" : "gray",
              }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="form-control mb-3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="text-center">
          <button className="btn btn-success" onClick={submitReview}>
            Submit Review
          </button>
        </div>

      </div>
    </div>
  );
};

export default Review;