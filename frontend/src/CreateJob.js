


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const CreateJob = () => {
    const navigate=useNavigate();
  const { id } = useParams(); // 👈 jobId milega edit me

  const [job, setJob] = useState({
    jobTitle: "",
    description: "",
    qualification: "",
    responsibilities: "",
    location: "",
    salaryRange: ""
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // ✅ EDIT MODE → data fill
  useEffect(() => {
    if (id) {
      axios.get("http://localhost:5000/api/getjobs")
        .then(res => {
          const foundJob = res.data.find(j => j._id === id);
          if (foundJob) setJob(foundJob);
        });
    }
  }, [id]);

  // ✅ CREATE + UPDATE
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (id) {
      // 🔥 UPDATE
      await axios.put(
        `http://localhost:5000/api/updatejob/${id}`,
        job,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Job Updated Successfully");
      navigate("/my-jobs");

    } else {
      // 🔥 CREATE
      await axios.post(
        "http://localhost:5000/api/createjob",
        job,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Job Posted Successfully");
      navigate("/home")
    }

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Error");
  }
};
if (role !== "employer") {
  return (
    <div className="text-center mt-5">
      <h3>❌ Access Denied (Only Employer)</h3>
    </div>
  );
}
  return (
    <div>
      <Navbar/>

    <form onSubmit={handleSubmit}>
      <h2>{id ? "Edit Job" : "Create Job"}</h2>

      <input
        name="jobTitle"
        value={job.jobTitle}
        placeholder="Job Title"
        onChange={handleChange}
      />

      <textarea
        name="description"
        value={job.description}
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        name="qualification"
        value={job.qualification}
        placeholder="Qualification"
        onChange={handleChange}
      />

      <textarea
        name="responsibilities"
        value={job.responsibilities}
        placeholder="Responsibilities"
        onChange={handleChange}
      />

      <input
        name="location"
        value={job.location}
        placeholder="Location"
        onChange={handleChange}
      />

      <input
        name="salaryRange"
        value={job.salaryRange}
        placeholder="Salary Range"
        onChange={handleChange}
      />

      <button type="submit">
        {id ? "Update Job" : "Post Job"}
      </button>
    </form>
        </div>

  );
};

export default CreateJob;