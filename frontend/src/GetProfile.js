

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";

const GetProfile = () => {
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url =
        role === "jobseeker"
          ? "http://localhost:5000/api/getprofile"
          : "http://localhost:5000/api/getemployerprofile";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data.profile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = () => {
    navigate(role === "jobseeker" ? "/updateprofile" : "/updateemployer-profile");
  };

  const handleCreate = () => {
    navigate(role === "jobseeker" ? "/jobseeker-profile" : "/employer-profile");
  };

  if (!profile) {
    return (
      <div className="text-center mt-5">
        <h5>Loading profile...</h5>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="bg-light min-vh-100">
        <div className="container py-4 d-flex justify-content-center">
          <div
            className="card shadow-lg border-0 p-4 w-100"
            style={{ maxWidth: "600px", borderRadius: "18px" }}
          >
            {/* HEADER */}
            <div className="text-center">
              <img
                src={
                  profile.pic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="rounded-circle shadow"
                width="100"
                height="100"
              />
              <h3 className="mt-2 fw-bold">{profile.name}</h3>
              <p className="text-muted">{profile.email}</p>
            </div>

            <hr />

            {/* BASIC INFO */}
            <p>📞 <b>Phone:</b> {profile.contactNo || "Not added"}</p>
            <p>📍 <b>Location:</b> {profile.location || "Not added"}</p>

            {/* JOBSEEKER INFO */}
            {role === "jobseeker" && (
              <>
                <p>🛠 <b>Skills:</b> {profile.skills || "Not added"}</p>
                <p>🎓 <b>Education:</b> {profile.education || "Not added"}</p>
                <p>💼 <b>Experience:</b> {profile.experience || "Fresher"}</p>
                <p>📝 <b>About:</b> {profile.about || "Not added"}</p>
              </>
            )}

            {/* EMPLOYER INFO */}
            {role === "employer" && (
              <>
                <p>🏢 <b>Company:</b> {profile.companyName}</p>
                <p>🌐 <b>Website:</b> {profile.website || "Not added"}</p>
                <p>🏭 <b>Industry:</b> {profile.industry || "Not added"}</p>
                <p>👥 <b>Company Size:</b> {profile.companySize || "Not added"}</p>
                <p>📄 <b>Description:</b> {profile.description || "Not added"}</p>
              </>
            )}

            {/* ROLE-BASED BUTTONS */}
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary btn-lg rounded-pill" onClick={handleUpdate}>
                ✏️ Update Profile
              </button>

              <button className="btn btn-outline-success btn-lg rounded-pill" onClick={handleCreate}>
                ➕ Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProfile;