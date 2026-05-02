import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employer.css";
import Navbar from "./Navbar";

const EmployerProfile = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    companyName: "",
    contactNo: "",
    location: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",
    logo: ""
  });

  const [email, setEmail] = useState("");
  const [isEdit,setIsEdit]=useState(false);

  const token = localStorage.getItem("token");

  // AUTH + GET PROFILE
  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    if (user.role !== "employer") {
      alert("Access denied ❌");
      navigate("/jobseeker-profile");
      return;
    }

    setEmail(user.email);

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try{

      const res = await axios.get(
        "http://localhost:5000/api/getemployerprofile",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if(res.data.profile){

        setForm(res.data.profile);
        setIsEdit(true);

      }

    }catch(err){
      console.log("No existing profile");
    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      if(isEdit){

        await axios.put(
          "http://localhost:5000/api/updateemployerprofile",
          form,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        alert("Profile Updated ✅");

      }
      else{

        await axios.post(
          "http://localhost:5000/api/createemployerprofile",
          form,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        alert("Profile Created ✅");
        navigate("/getemployerprofile")

      }

    }catch(err){

      alert(err.response?.data?.message || "Error ❌");

    }

  };

  return (

    <div>
      <Navbar/>
    <form onSubmit={handleSubmit}>

      <h2 className="form-title">
        {isEdit ? "Update Employer Profile" : "Create Employer Profile"}
      </h2>

      <input value={email} disabled />

      <input
        name="name"
        value={form.name}
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        name="companyName"
        value={form.companyName}
        placeholder="Company Name"
        onChange={handleChange}
      />

      <input
        name="contactNo"
        value={form.contactNo}
        placeholder="Contact No"
        onChange={handleChange}
      />

      <input
        name="location"
        value={form.location}
        placeholder="Location"
        onChange={handleChange}
      />

      <input
        name="industry"
        value={form.industry}
        placeholder="Industry"
        onChange={handleChange}
      />

      <input
        name="companySize"
        value={form.companySize}
        placeholder="Company Size"
        onChange={handleChange}
      />

      <input
        name="website"
        value={form.website}
        placeholder="Website"
        onChange={handleChange}
      />

      <textarea
        name="description"
        value={form.description}
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        name="logo"
        value={form.logo}
        placeholder="Logo URL"
        onChange={handleChange}
      />

      <button>
        {isEdit ? "Update Profile" : "Create Profile"}
      </button>

    </form>
    </div>

  );

};

export default EmployerProfile;