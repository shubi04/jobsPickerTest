// import React, { useState,useEffect } from "react";
// import axios from "axios";
// import "./signup.css";
// import { useNavigate } from "react-router-dom";

// const EmployerSignup = () => {

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [contactNo, setContactNo] = useState("");
//   const [companyName, setCompanyName] = useState(""); 


//   const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//   useEffect(() => {
//     if(token){
//       navigate("/"); // redirect if already logged in
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//       if (password.length < 6) {
//     alert("Password must be at least 6 characters");
//     return;
//   }

  
//   if (!/^\d{10}$/.test(contactNo)) {
//     alert("Contact number must be 10 digits");
//     return;
//   }


//     try {
//       const res = await axios.post("http://localhost:5000/api/register", {
//         name,
//         email,
//         password,
//         role: "employer", 
//         contactNo,
//         companyName,   
//       });

//       alert("Employer Signup successful!");
//       console.log(res.data);
//             navigate("/verifyotp", { state: { email } });


//       navigate("/login");

//     } catch (error) {
//       console.log(error);
//       alert("Signup failed!");
//     }
//   };

// return (
//   <div className="signup-wrapper">
//     <form onSubmit={handleSubmit} className="signup-form">

//       <h2 className="form-title">Employer Signup 🚀</h2>
//       <p className="subtitle">Create your company account</p>

//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Enter contact number"
//         value={contactNo}
//         onChange={(e) => setContactNo(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Enter Company Name"
//         value={companyName}
//         onChange={(e) => setCompanyName(e.target.value)}
//       />

//       <button type="submit">Signup</button>

//       <p className="signup-link">
//         Already have an account?
//         <span onClick={() => navigate("/login")}> Login</span>
//       </p>
//     </form>
//   </div>
// );
// };

// export default EmployerSignup;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployerSignup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain 8 characters, 1 uppercase, 1 number and 1 special character"
      );
      return;
    }

    if (!/^\d{10}$/.test(contactNo)) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
        role: "employer",
        contactNo,
        companyName,
      });

      alert("Employer Signup successful ✅");
      navigate("/verifyotp", { state: { email } });

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed ❌");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg,#ff9a9e,#fad0c4,#a1c4fd,#c2e9fb)",
      }}
    >

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow-lg"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >

        <h2 className="text-center fw-bold mb-2">
          Employer Signup 🚀
        </h2>

        <p className="text-center text-muted fs-5 mb-4">
          Create your company account
        </p>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="position-relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "8px",
              cursor: "pointer",
              fontSize: "18px",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <small className="text-muted">
          Password must contain 8 characters, 1 uppercase, 1 number & symbol
        </small>

        <input
          type="text"
          className="form-control mt-3 mb-3"
          placeholder="Enter contact number"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="text-center text-dark fs-5 mt-3">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="fw-bold text-primary ms-1"
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
};

export default EmployerSignup;