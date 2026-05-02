


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import ApplyButton from "./ApplyButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import Footer from "./Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || "";

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const appliedJobIds = applications.map((app) => app.jobId?._id);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 📦 Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getjobs");

        if (role === "employer") {
          setJobs(res.data.filter((j) => j.employerId?.email === email));
        } else {
          setJobs(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [role, email]);

  // 📌 Fetch Applications
  const fetchApplications = async () => {
    try {
      const url =
        role === "jobseeker"
          ? "http://localhost:5000/api/myapplications"
          : "http://localhost:5000/api/employerapplications";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [role]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ❌ Delete Job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/deletejob/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // ✔ Mark Application Completed
  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/updateapplication/${id}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* ✅ NAVBAR */}
      <Navbar onLogout={handleLogout} />

      {/* 🟢 MAIN CONTENT */}
      <div className="container py-4">
        <h2 className="fw-bold mb-4 text-center">
          Welcome {user?.name} 👋
        </h2>
        <div className="d-flex justify-content-center gap-3 mb-4">

<button
className="btn btn-primary"
onClick={() => navigate("/myapplications")}
>
My Applications 📄
</button>

<button
className="btn btn-success"
onClick={() => navigate("/getcandidateinterviews")}
>
My Interviews 📅
</button>

</div>

        {/* EMPLOYER DASHBOARD */}
        {role === "employer" && (
          <>
            <h4 className="fw-bold mb-3">My Jobs</h4>
            <div className="row g-4">
              {jobs.map((job) => (
                <div className="col-md-4" key={job._id}>
                  <div className="card shadow border-0 h-100">
                    <div className="card-body">
                      <h5 className="text-primary">{job.jobTitle}</h5>
                      <p>📍 {job.location}</p>
                      <p>💰 {job.salaryRange}</p>
                    </div>
                    <div className="card-footer bg-white d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm w-50"
                        onClick={() => navigate(`/updatejob/${job._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm w-50"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="mt-5 mb-3">Applications</h4>
            {applications.length === 0 ? (
              <p className="text-muted">No applications yet for your jobs.</p>
            ) : (
              <div className="row g-4">
                {applications.map((app) => (
                  <div className="col-md-6" key={app._id}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title text-primary mb-1">
                            {app.jobId?.jobTitle || "Job Title"}
                          </h5>
                          <p className="mb-1">
                            <strong>Candidate:</strong> {app.userId?.name || "Unknown"}
                          </p>
                          <p className="mb-1">
                            <strong>Email:</strong> {app.userId?.email || "Unknown"}
                          </p>
                          {app.resume && (
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-info mt-1"
                            >
                              View Resume
                            </a>
                          )}
                        </div>
                        <div className="text-end">
                          <button
                            className="btn btn-success btn-sm mb-1 w-100"
                            disabled={app.status === "completed"}
                            onClick={() => handleMarkCompleted(app._id)}
                          >
                            {app.status === "completed" ? "Completed ✅" : "Mark Completed"}
                          </button>
                          <span
                            className={`badge mt-2 ${
                              app.status === "completed"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {app.status
                              ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* JOBSEEKER DASHBOARD */}
        {role === "jobseeker" && (
          <>
          {role === "jobseeker" && (

<div className="row text-center mb-4">

<div className="col-md-4">
<div className="card shadow-sm p-3">
<h5>Applications</h5>
<h3>{applications.length}</h3>
</div>
</div>

<div className="col-md-4">
<div className="card shadow-sm p-3">
<h5>Jobs Available</h5>
<h3>{jobs.length}</h3>
</div>
</div>

<div className="col-md-4">
<div className="card shadow-sm p-3">
<h5>Interviews</h5>
<h3>
{
applications.filter(a => a.status === "interview_scheduled").length
}
</h3>
</div>
</div>

</div>

)}
            <h4 className="fw-bold mb-3">Available Jobs</h4>
            <div className="row g-4">
              {jobs.map((job) => (
                <div className="col-md-4" key={job._id}>
                  <div className="card shadow border-0 h-100">
                    <div className="card-body">
                      <h5 className="text-primary">{job.jobTitle}</h5>
                      <p>📍 {job.location}</p>
                      <p>💰 {job.salaryRange}</p>
                    </div>
                    <div className="card-footer bg-white">
                      {appliedJobIds.includes(job._id) ? (
                        <button className="btn btn-success w-100" disabled>
                          Applied ✅
                        </button>
                      ) : (
                        <ApplyButton jobId={job._id} onApplied={fetchApplications} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer/>
    </div>
    
  );

};

export default Dashboard;