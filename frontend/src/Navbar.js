
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
const navigate = useNavigate();
const role = localStorage.getItem("role");
const user = JSON.parse(localStorage.getItem("user"));
const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

const handleLogout = () => {
localStorage.clear();
navigate("/", { replace: true });
};

const buttonStyle = {
  padding: "10px 24px",
  fontWeight: "700",   // sab bold
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: "25px",
  transition: "all 0.3s ease",
  fontSize: "17px",    // size large
  letterSpacing: "0.5px"
};
const hoverIn = (e) => {
e.currentTarget.style.background = "#2563eb";
  e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.4)";

};

const hoverOut = (e) => {
e.currentTarget.style.background = "rgba(255,255,255,0.08)";
};

return (
<nav
className="navbar navbar-expand-lg shadow-sm"
style={{
background: "linear-gradient(90deg,#020617,#0f172a,#1e293b)",
padding: "14px 40px",
fontFamily: "Poppins, sans-serif"
}}
>
{/* LOGO */}
<span
className="navbar-brand fw-bold text-white"
style={{
cursor: "pointer",
letterSpacing: "1px",
fontSize: "20px"
}}
onClick={() => navigate("/")}
>
🚀 SMART HIRE</span>

```
  {/* MOBILE MENU ICON */}
  <button
    className="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarMenu"
    style={{ border: "none", filter: "invert(1)" }}
  >
    <span className="navbar-toggler-icon"></span>
  </button>

  {/* MENU */}
  <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarMenu">
    <div className="ms-auto d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-3">

      <button
        style={{...buttonStyle,fontWeight:"700", fontSize:"17px"}}
        onMouseOver={hoverIn}
        onMouseOut={hoverOut}
        onClick={() => navigate("/home")}
      >
        Home
      </button>

      <button
        style={{...buttonStyle,fontWeight:"700", fontSize:"17px"}}
        onMouseOver={hoverIn}
        onMouseOut={hoverOut}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      {/* PROFILE */}
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          style={buttonStyle}
          data-bs-toggle="dropdown"
          onMouseOver={hoverIn}
          onMouseOut={hoverOut}
        >
          👤 Profile
        </button>

        <ul className="dropdown-menu shadow border-0 rounded-3">
          {role === "jobseeker" && (
            <>
              <li><button className="dropdown-item" onClick={() => navigate("/jobseeker-profile")}>Create Profile</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/getprofile")}>My Profile</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/updateprofile")}>Update Profile</button></li>
            </>
          )}

          {role === "employer" && (
            <>
              <li><button className="dropdown-item" onClick={() => navigate("/employer-profile")}>Create Profile</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/getemployerprofile")}>My Profile</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/updateemployer-profile")}>Update Profile</button></li>
            </>
          )}
        </ul>
      </div>

      {/* JOBS */}
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          style={buttonStyle}
          data-bs-toggle="dropdown"
          onMouseOver={hoverIn}
          onMouseOut={hoverOut}
        >
          💼 Jobs
        </button>

        <ul className="dropdown-menu shadow border-0 rounded-3">
          {role === "jobseeker" && (
            <>
              <li><button className="dropdown-item" onClick={() => navigate("/getalljobs")}>All Jobs</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/myapplications")}>Applied Jobs</button></li>
            </>
          )}

          {role === "employer" && (
            <>
              <li><button className="dropdown-item" onClick={() => navigate("/createjob")}>Create Job</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/getalljobs")}>My Jobs</button></li>
              <li><button className="dropdown-item" onClick={() => navigate("/employerapplications")}>Applications</button></li>
            </>
          )}
        </ul>
      </div>

      <button
        style={buttonStyle}
        onMouseOver={hoverIn}
        onMouseOut={hoverOut}
        onClick={() => navigate("/contact")}
      >
        Contact
      </button>

      {/* PROFILE ICON */}
      <div
        className="d-none d-lg-flex align-items-center justify-content-center text-white fw-bold rounded-circle"
        style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg,#6366f1,#2563eb)"
        }}
      >
        {firstLetter}
      </div>

      {/* LOGOUT */}
      <button
        className="btn btn-danger btn-sm rounded-pill px-3"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  </div>
</nav>


);
};

export default Navbar;
