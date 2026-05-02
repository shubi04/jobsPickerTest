

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const MyApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/myapplications", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setApplications(res.data);
//     } catch (err) {
//       console.error("Error fetching applications:", err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">My Applications</h2>

//       {applications.length === 0 ? (
//         <p className="text-center text-muted">No applications found 😢</p>
//       ) : (
//         applications.map((app) => (
//           <div key={app._id} className="card mb-3 p-3 shadow-sm">
//             <h5>{app.jobId?.jobTitle}</h5>

//             <p><b>Your Name:</b> {app.userId?.name}</p>
//             <p><b>Your Email:</b> {app.userId?.email}</p>

//             <p><b>Location:</b> {app.jobId?.location}</p>
//             <p><b>Salary:</b> {app.jobId?.salaryRange}</p>

//             {app.resume && (
//               <p>
//                 <b>Resume:</b>{" "}
//                 <a href={app.resume} target="_blank" rel="noreferrer">
//                   View Resume
//                 </a>
//               </p>
//             )}

//             <p>
//               <b>Status:</b>{" "}
//               <span
//                 className={
//                   app.status === "accepted"
//                     ? "text-success"
//                     : app.status === "rejected"
//                     ? "text-danger"
//                     : app.status === "interview_scheduled"
//                     ? "text-primary"
//                     : "text-warning"
//                 }
//               >
//                 {app.status || "pending"}
//               </span>
//             </p>

//             {/* ⭐ Interview Button */}
//             {app.status === "interview_scheduled" && (
//               <button
//                 className="btn btn-primary mt-2"
//                 onClick={() =>navigate("/getcandidateinterviews")}
//               >
//                 View Interview 📅
//               </button>
//             )}

//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyApplications;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/myapplications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">My Applications</h2>

      {/* ⭐ Back Button */}
      <div className="text-center mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard 🏠
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="text-center text-muted">No applications found 😢</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="card mb-3 p-3 shadow-sm">

            <h5>{app.jobId?.jobTitle}</h5>

            <p><b>Your Name:</b> {app.userId?.name}</p>
            <p><b>Your Email:</b> {app.userId?.email}</p>

            <p><b>Location:</b> {app.jobId?.location}</p>
            <p><b>Salary:</b> {app.jobId?.salaryRange}</p>

            {app.resume && (
              <p>
                <b>Resume:</b>{" "}
                <a href={app.resume} target="_blank" rel="noreferrer">
                  View Resume
                </a>
              </p>
            )}

            <p>
              <b>Status:</b>{" "}
              <span
                className={
                  app.status === "accepted"
                    ? "text-success"
                    : app.status === "rejected"
                    ? "text-danger"
                    : app.status === "interview_scheduled"
                    ? "text-primary"
                    : "text-warning"
                }
              >
                {app.status || "pending"}
              </span>
            </p>

            {/* ⭐ Interview Button */}
            {app.status === "interview_scheduled" && (
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate("/getcandidateinterviews")}
              >
                View Interview 📅
              </button>
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;  