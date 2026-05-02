
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ApplyButton from "./Pages/ApplyButton";
import ContactUs from "./Pages/Contact";
import Navbar from "./Navbar";
import Footer from "./Pages/Footer";

const HomePage = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const[totalApplications,setTotalApplications] = useState(0);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const email = user?.email || "";
  const appliedJobIds = applications.map(app => app.jobId?._id);

  // 🔐 Redirect
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // 📦 Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getjobs");

        if (role === "employer") {
          const myJobs = res.data.filter(
            (job) => job.employerId?.email === email
          );
          setJobs(myJobs);
        } else {
          setJobs(res.data);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, [role]);

  // 📌 Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/myapplications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (role === "jobseeker") {
      fetchApplications();
    }
  }, [role]);

  const fetchApplicationsCount = async () => {

try{

const res = await axios.get(
"http://localhost:5000/api/employerapplicationscount",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setTotalApplications(res.data.totalApplications);

}catch(error){
console.log(error);
}

};
useEffect(()=>{
fetchApplicationsCount();
},[]);
  // ❌ Delete Job
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/deletejob/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs(jobs.filter((job) => job._id !== id));

    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-light min-vh-100">

      {/* ✅ NAVBAR */}
      <Navbar />

      {/* 🔥 HERO / ACTION SECTION */}
      <div className="container py-4">

        {role === "employer" ? (
          <div className="text-center">

            <h2 className="fw-bold">
              Welcome {user?.name} 👋
            </h2>

            <p className="text-muted">
              Manage your jobs and hire talent easily
            </p>

            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">

              <button
                className="btn btn-success px-4"
                onClick={() => navigate("/createjob")}
              >
                ➕ Post Job
              </button>

              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/dashboard")}
              >
                📊 My Jobs
              </button>

              <button
                className="btn btn-warning px-4"
                onClick={() => navigate("/employerapplications")}
              >
                📥 Applications
              </button>

            </div>

          </div>
        ) : (
          <div className="text-center">

            <h1 className="fw-bold display-5">
              Find Your Dream Job 🚀
            </h1>

            <p className="text-muted fs-5">
              Explore thousands of opportunities
            </p>

            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={() => navigate("/getalljobs")}
            >
              Explore Jobs
            </button>

          </div>
        )}

      </div>

      {/* 🔥 STATS (EMPLOYER ONLY) */}
      {role === "employer" && (
        <div className="container mb-4">
          <div className="row g-3">

            <div className="col-md-4">
              <div className="card shadow text-center p-3">
                <h6>Total Jobs</h6>
                <h4 className="text-primary">{jobs.length}</h4>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow text-center p-3">
                <h4 className="text-success">Total Application</h4>

                <h6>{totalApplications}</h6>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow text-center p-3">
                <h6>Status</h6>
                <h4 className="text-warning">Active</h4>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 📦 JOBS SECTION */}
      <div className="container pb-5">

        <h3 className="mb-4 fw-bold border-start border-4 border-primary ps-3">
          {role === "employer" ? "Your Posted Jobs" : "Available Jobs"}
        </h3>

        {jobs.length === 0 ? (
          <div className="alert alert-info text-center">
            No jobs available 😔
          </div>
        ) : (
          <div className="row g-4">

            {jobs.map((job) => (

              <div className="col-md-4" key={job._id}>
                <div className="card shadow border-0 h-100 rounded-4">

                  <div className="card-body">
                    <h5 className="fw-bold text-primary">{job.jobTitle}</h5>
                    <p className="text-muted small">📍 {job.location}</p>
                    <p className="small">🎓 {job.qualification}</p>
                    <p className="small text-truncate">{job.responsibilities}</p>
                    <h6 className="text-success fw-bold">💰 {job.salaryRange}</h6>
                  </div>

                  <div className="p-3">

                    {/* JOBSEEKER */}
                    {role === "jobseeker" && (
                      appliedJobIds.includes(job._id) ? (
                        <button className="btn btn-success w-100" disabled>
                          Applied ✅
                        </button>
                      ) : (
                        <ApplyButton jobId={job._id} onApplied={fetchApplications} />
                      )
                    )}

                    {/* EMPLOYER */}
                    {role === "employer" &&
                      job.employerId?.email === email && (
                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-primary w-50"
                            onClick={() => navigate(`/updatejob/${job._id}`)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger w-50"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </button>
                    <button
className="btn btn-dark"
onClick={() => navigate(`/employerapplications/${job._id}`)}
>
Applications
</button>

                        </div>
                      )}

                  </div>

                </div>
              </div>

            ))}

          </div>
        )}

      </div>
<div
  className="text-center py-5"
  style={{
    background: "#0b1220",
    color: "white",
    borderTop: "1px solid rgba(255,255,255,0.05)"
  }}
>
  <h2 className="fw-bold mb-3" style={{ fontSize: "34px" }}>
    About Smart Hire 🚀
  </h2>

  <p
    style={{
      maxWidth: "750px",
      margin: "auto",
      fontSize: "17px",
      color: "#9ca3af",
      lineHeight: "1.8"
    }}
  >
Smart Hire is a modern career platform designed to connect talented job 
seekers with the right opportunities. Our platform helps candidates discover jobs, build strong profiles, and apply easily, while enabling
 companies to find skilled professionals efficiently through a smart and user-friendly system.    
  </p>

  <button
    className="btn mt-4 px-4 py-2 fw-bold"
    style={{
      borderRadius: "30px",
      background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
      border: "none",
      color: "white"
    }}
    onClick={() => navigate("/about")}
  >
    Read More →
  </button>
</div>
      {/* 📘 ABOUT */}


      {/* 📞 CONTACT */}
      <ContactUs />

      {/* 🦶 FOOTER */}
      <Footer/>

    </div>
  );
};

export default HomePage;