
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ApplyButton from "./Pages/ApplyButton";

// const GetAllJobs = () => {

//   const [jobs, setJobs] = useState([]);
//   const [appliedJobIds, setAppliedJobIds] = useState([]);
//   const [keyword, setKeyword] = useState("");
//   const [location, setLocation] = useState("");

//   const navigate = useNavigate();

//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem("token");
//   const email = localStorage.getItem("email");

// const fetchJobs = async () => {
//   try {

//     let url = "http://localhost:5000/api/getjobs";

//     // ✅ agar search hai tabhi query lagao
//     if (keyword.trim() || location.trim()) {
//       url += `?keyword=${keyword.trim()}&location=${location.trim()}`;
//     }

//     const res = await axios.get(url);

//     setJobs(res.data);

//   } catch (error) {
//     console.log(error);
//   }
// };
// useEffect(() => {
//   fetchJobs(); // ✅ page load pe call
// }, []);
// const fetchAppliedJobs = async () => {
//   try {
//     const res = await axios.get(
//       "http://localhost:5000/api/myapplications",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );


//     // sirf jobId ka array banao
//     const ids = res.data.map((app) => app.jobId._id);
//     setAppliedJobIds(ids);

//   } catch (error) {
//     console.log(error);
//   }
// };
// useEffect(() => {
//   fetchJobs();
//   fetchAppliedJobs(); // ✅ add this
// }, []);
//   // ✅ DELETE JOB
//   const handleDelete = async (id) => {

//     const confirmDelete = window.confirm("Are you sure?");
//     if (!confirmDelete) return;

//     try {

//       await axios.delete(
//         `http://localhost:5000/api/deletejob/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setJobs(jobs.filter((job) => job._id !== id));
//       alert("Deleted ✅");

//     } catch (error) {
//       alert("Delete failed");
//     }

//   };

//   return (

//     <div className="jobs-container">

//       <h2>Available Jobs</h2>

//       {/* 🔍 SEARCH UI */}
//       <div style={{ marginBottom: "20px" }}>
        
//         <input
//   value={keyword} placeholder="Search by title or description"
//   onChange={(e) => setKeyword(e.target.value)}
// />

// <input
//   value={location} placeholder="Search by Location"
//   onChange={(e) => setLocation(e.target.value)}
// />
//         <button onClick={fetchJobs} style={{ marginLeft: "10px" }}>
//           Search
//         </button>
//       </div>

//       <div className="jobs-grid">

//         {jobs.map((job) => (

//           <div className="job-card" key={job._id}>

//             <h3>{job.jobTitle}</h3>

//             <p><b>Description:</b> {job.description}</p>
//             <p><b>Qualification:</b> {job.qualification}</p>
//             <p><b>Responsibilities:</b> {job.responsibilities}</p>
//             <p><b>Location:</b> {job.location}</p>
//             <p><b>Salary:</b> {job.salaryRange}</p>

//             <p className="email">
//               Posted by: {job.employerId?.email}
//             </p>

//             <div style={{ marginTop: "10px" }}>

//               {/* ✅ APPLY BUTTON COMPONENT */}

// {role?.toLowerCase() === "jobseeker" && (

//   appliedJobIds.includes(job._id) ? (

//     <button
//       className="btn btn-success w-100"
//       disabled
//     >
//       Applied ✅
//     </button>

//   ) : (

//     <ApplyButton jobId={job._id} />

//   )

// )}
//               {/* ✅ EMPLOYER CONTROLS */}
//               {role?.toLowerCase() === "employer" &&
//                job.employerId?.email === email && (

//                 <>

//                   <button
//                     onClick={() => navigate(`/updatejob/${job._id}`)}
//                     style={{ background: "#007bff", color: "#fff", marginRight: "10px" }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(job._id)}
//                     style={{ background: "red", color: "#fff" }}
//                   >
//                     Delete
//                   </button>

//                 </>

//               )}

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>

//   );

// };

// export default GetAllJobs;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApplyButton from "./Pages/ApplyButton";
import Navbar from "./Navbar";

const GetAllJobs = () => {

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // 🔍 FETCH JOBS
  const fetchJobs = async () => {
    try {
      let url = "http://localhost:5000/api/getjobs";

      if (keyword.trim() || location.trim()) {
        url += `?keyword=${keyword.trim()}&location=${location.trim()}`;
      }

      const res = await axios.get(url);
      setJobs(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // 📌 FETCH APPLIED JOBS
  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/myapplications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const ids = res.data.map((app) => app.jobId._id);
      setAppliedJobIds(ids);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // ❌ DELETE JOB
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/deletejob/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setJobs(jobs.filter((job) => job._id !== id));
      alert("Deleted ✅");

    } catch (error) {
      alert("Delete failed");
    }
  };

  return (

    <div>
      <Navbar/>
    <div className="container py-4">

      {/* 🔥 TITLE */}
      <h2 className="text-center mb-4 fw-bold text-primary">
        🚀 Available Jobs
      </h2>

      {/* 🔍 SEARCH */}
      <div className="row mb-4 justify-content-center">

        <div className="col-md-4 mb-2">
          <input
            className="form-control"
            value={keyword}
            placeholder="Search by title or description"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2">
          <input
            className="form-control"
            value={location}
            placeholder="Search by location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="col-md-2 mb-2">
          <button className="btn btn-success w-100" onClick={fetchJobs}>
            Search
          </button>
        </div>

      </div>

      {/* 📦 JOBS GRID */}
      <div className="row">

        {jobs.map((job) => (
          console.log("JOBID",job._id),

          <div className="col-md-6 col-lg-4 mb-4" key={job._id}>

            <div className="card shadow-sm h-100 border-0">

              <div className="card-body">

                <h5 className="card-title text-primary fw-bold">
                  {job.jobTitle}
                </h5>

                <p className="card-text small">
                  <b>Description:</b> {job.description}
                </p>

                <p className="card-text small">
                  <b>Qualification:</b> {job.qualification}
                </p>

                <p className="card-text small">
                  <b>Responsibilities:</b> {job.responsibilities}
                </p>

                <p className="card-text small">
                  <b>Location:</b> {job.location}
                </p>

                <p className="fw-bold text-success">
                  💰 ₹ {job.salaryRange}
                </p>

                <p className="text-muted small">
                  Posted by: {job.employerId?.email}
                </p>

                {/* 🔘 APPLY / APPLIED */}
                {role?.toLowerCase() === "jobseeker" && (
                  appliedJobIds.includes(job._id) ? (
                    <button className="btn btn-success w-100" disabled>
                      Applied ✅
                    </button>
                  ) : (
                    <ApplyButton jobId={job._id} />
                  )
                )}

                {/* 🛠️ EMPLOYER ACTIONS */}
                {role?.toLowerCase() === "employer" &&
                  job.employerId?.email === email && (

                  <div className="d-flex gap-2 mt-3">

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

    </div>
        </div>

  );
};

export default GetAllJobs;