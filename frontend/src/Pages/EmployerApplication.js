import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import ScheduleInterviewModal from "./Interview";
function EmployerApplications() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const token = localStorage.getItem("token");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const openInterviewModal = (app) => {
    setSelectedAppId(app._id);
    setShowModal(true);
  };

  const closeInterviewModal = () => {
    setShowModal(false);
    setSelectedAppId(null);
  };

  // Fetch applications
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const url = id 
          ? `http://localhost:5000/api/employerapplications/${id}` 
          : `http://localhost:5000/api/employerapplications`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setApps(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApps();
  }, [id, token]);

  // Update status
  const updateStatus = async (appId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/updateapplication/${appId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApps(apps.map(app => app._id === appId ? { ...app, status } : app));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container py-4">
        <h2 className="text-center mb-4">📄 Job Applications</h2>

        {apps.length === 0 ? (
          <p>No applications found</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app._id}>
                  <td>{app.userId?.name}</td>
                  <td>{app.userId?.email}</td>
                  <td>
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-info"
                    >
                      View Resume
                    </a>
                  </td>
                  <td>
                    {app.status === "accepted" && (
                      <button
                        className="btn btn-info btn-sm ms-2"
                        onClick={() => openInterviewModal(app)}
                      >
                        Schedule Interview
                      </button>
                    )}
                    {app.status === "rejected" && (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                    {app.status === "pending" && (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                    {app.status === "interview_scheduled" && (
                      <span className="badge bg-primary">Interview Scheduled</span>
                    )}
                  </td>
<td>
<button
  className="btn btn-success btn-sm me-2"
  disabled={
    app.status === "accepted" ||
    app.status === "rejected" ||
    app.status === "interview_scheduled"
  }
  onClick={() => updateStatus(app._id, "accepted")}
>
  Accept
</button>

<button
  className="btn btn-danger btn-sm"
  disabled={
    app.status === "accepted" ||
    app.status === "rejected" ||
    app.status === "interview_scheduled"
  }
  onClick={() => updateStatus(app._id, "rejected")}
>
  Reject
</button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        show={showModal}
        onClose={closeInterviewModal}
        applicationId={selectedAppId}
        fetchApplications={() => {
          const url = id 
            ? `http://localhost:5000/api/employerapplications/${id}` 
            : `http://localhost:5000/api/employerapplications`;
          fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setApps(data));
        }}
      />
    </div>
  );
}

export default EmployerApplications;