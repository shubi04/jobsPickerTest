import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const EmployerInterviews = () => {

const [interviews,setInterviews]=useState([]);

const token=localStorage.getItem("token");

const fetchInterviews = async () => {
  try {

    const res = await axios.get(
      "http://localhost:5000/api/getemployerinterviews",
      {
        headers:{ Authorization:`Bearer ${token}` }
      }
    );

    console.log("Interviews:", res.data);   // 👈 ye add karo

    setInterviews(res.data);

  } catch(err) {
    console.log(err);
  }
};

useEffect(()=>{

fetchInterviews();

},[]);

return(

<div>

<Navbar/>

<div className="container mt-4">

<h2 className="mb-4">Scheduled Interviews 📅</h2>

{interviews.length===0 && (
<p>No interviews scheduled</p>
)}

{interviews.map((i)=>(

<div className="card p-3 mb-3" key={i._id}>

<h5>💼 Job : {i.jobId?.jobTitle}</h5>

<p>👤 Candidate : {i.candidateId?.name}</p>

<p>📧 Email : {i.candidateId?.email}</p>

<p>📅 Date : {i.date ? new Date(i.date).toLocaleDateString() : "-"}</p>

<p>⏰ Time : {i.date ? new Date(i.date).toLocaleTimeString() : "-"}</p>
<p>💻 Mode : {i.mode}</p>

<p>📍 Location : {i.location || "Online Meeting"}</p>

<p>📌 Status : {i.status}</p>

</div>

))}

</div>

</div>

);

};

export default EmployerInterviews;