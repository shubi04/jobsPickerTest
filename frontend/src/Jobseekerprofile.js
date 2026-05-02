import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Jobseekerprofile.css";
import Navbar from "./Navbar";

const JobSeekerProfile = () => {
  const navigate = useNavigate();

  const [pic, setPic] = useState(null);
  const [picUrl, setPicUrl] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [email, setEmail] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    contactNo: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    about: "",
  });

  const [completion, setCompletion] = useState(0);  
  // ✅ CHECK USER + SET EMAIL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      alert("Access denied ❌");
      navigate("/");
      return;
    }

    setEmail(user.email);

    // ✅ GLOBAL TOKEN SET
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  }, []);

  // ✅ FETCH PROFILE AFTER EMAIL SET
  useEffect(() => {
    if (email) {
      fetchProfile();
    }
  }, [email]);

  // ✅ FETCH PROFILE

const fetchProfile = async () => {
  try {

    const res = await axios.get("http://localhost:5000/api/getprofile");

    if (res.data.profile) {

      const data = res.data.profile;

      setProfileExists(true); // ⭐ ADD THIS

      setProfile({
        name: data.name || "",
        contactNo: data.contactNo || "",
        location: data.location || "",
        skills: data.skills || "",
        experience: data.experience || "",
        education: data.education || "",
        about: data.about || "",
      });

      setPicUrl(data.pic || "");
      setResumeUrl(data.resume || "");
calculateCompletion(data);
    }

  } catch (err) {
    console.log("No profile found");
  }
};
const calculateCompletion = (data) => {

  let filled = 0;
  let total = 7;

  if (data.name) filled++;
  if (data.contactNo) filled++;
  if (data.location) filled++;
  if (data.skills) filled++;
  if (data.experience) filled++;
  if (data.education) filled++;
  if (data.about) filled++;

  const percent = Math.round((filled / total) * 100);

  setCompletion(percent);
};
  // ✅ INPUT CHANGE
const handleChange = (e) => {

  const updated = { ...profile, [e.target.name]: e.target.value };

  setProfile(updated);

  calculateCompletion(updated);

};
  // ✅ UPLOAD PIC
  const uploadPic = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "service");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnrels1zh/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    if (result.secure_url) setPicUrl(result.secure_url);
  };

  // ✅ UPLOAD RESUME
  const uploadResume = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "service");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnrels1zh/raw/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    if (result.secure_url) setResumeUrl(result.secure_url);
  };

  useEffect(() => {
    if (pic) uploadPic(pic);
  }, [pic]);

  useEffect(() => {
    if (resume) uploadResume(resume);
  }, [resume]);

  // ✅ CREATE PROFILE
  const handleSubmit = async () => {
    if (!profile.name) return alert("Name required");
    if (!picUrl || !resumeUrl) return alert("Upload pic & resume");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/createprofile",
        {
          ...profile,
          email,
          pic: picUrl,
          resume: resumeUrl,
        }
      );

      alert(res.data.message);
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async () => {
    if (!profile.name) return alert("Name required");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/updateprofile",
        {
          ...profile,
          pic: picUrl,
          resume: resumeUrl,
        }
      );

      alert(res.data.message);
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  //... spread operator-copy arrays values 
  return (
    <div>
    <Navbar/>
    
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">

      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px", borderRadius: "15px" }}>

        {/* HEADING */}
        <div className="text-center mb-3">
          <h2 className="fw-bold">Job Seeker Profile 👤</h2>
          <p className="text-muted">Complete your profile to get better jobs</p>
          <div className="mb-3">

  <p className="fw-bold">
    Profile Completion : {completion}%
  </p>

  <div className="progress">
    <div
      className="progress-bar bg-success"
      role="progressbar"
      style={{ width: `${completion}%` }}
    >
      {completion}%
    </div>
  </div>

</div>
        </div>

        {/* PIC */}
        <div className="mb-3">
          <label className="form-label">📸 Profile Picture</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPic(e.target.files[0])}
          />
          {picUrl && (
            <div className="text-center mt-2">
              <img
                src={picUrl}
                alt="profile"
                className="rounded-circle"
                width="100"
                height="100"
              />
            </div>
          )}
        </div>

        {/* RESUME */}
        <div className="mb-3">
          <label className="form-label">📄 Resume</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setResume(e.target.files[0])}
          />
          {resumeUrl && (
            <p className="text-success mt-2">Resume Uploaded ✅</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <input value={email} readOnly className="form-control bg-light" />
        </div>

        {/* INPUTS */}
        <div className="mb-2">
          <input className="form-control" name="name" value={profile.name} onChange={handleChange} placeholder="Full Name" />
        </div>

        <div className="mb-2">
          <input className="form-control" name="contactNo" value={profile.contactNo} onChange={handleChange} placeholder="Contact Number" />
        </div>

        <div className="mb-2">
          <input className="form-control" name="location" value={profile.location} onChange={handleChange} placeholder="Location" />
        </div>

        <div className="mb-2">
          <input className="form-control" name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills" />
        </div>

        <div className="mb-2">
          <input className="form-control" name="experience" value={profile.experience} onChange={handleChange} placeholder="Experience" />
        </div>

        <div className="mb-2">
          <input className="form-control" name="education" value={profile.education} onChange={handleChange} placeholder="Education" />
        </div>

        <div className="mb-3">
          <textarea className="form-control" name="about" value={profile.about} onChange={handleChange} placeholder="About you" />
        </div>

        {/* BUTTONS */}
        {/* <div className="d-grid gap-2">
          <button className="btn btn-success" onClick={handleSubmit}>
            💾 Save Profile
          </button>

          <button className="btn btn-primary" onClick={handleUpdate}>
            ✏️ Update Profile
          </button>
        </div> */}

        <div className="d-grid gap-2">

  {!profileExists && (
    <button className="btn btn-success" onClick={handleSubmit}>
      💾 Save Profile
    </button>
  )}

  {profileExists && (
    <button className="btn btn-primary" onClick={handleUpdate}>
      ✏️ Update Profile
    </button>
  )}

</div>

      </div>
    </div>
  </div>
  );

};

export default JobSeekerProfile;