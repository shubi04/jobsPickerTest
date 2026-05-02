// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../Navbar";

// const CandidateInterviews = () => {

// const [interviews,setInterviews]=useState([]);

// const token = localStorage.getItem("token");

// const fetchInterviews = async () => {

// try{

// const res = await axios.get(
// "http://localhost:5000/api/getcandidateinterviews",
// {
// headers:{
// Authorization:`Bearer ${token}`
// }
// }
// );

// setInterviews(res.data);

// }catch(err){

// console.log(err);

// }

// };

// useEffect(()=>{

// fetchInterviews();

// },[]);

// return(

// <div>

// <Navbar/>

// <div className="container mt-4">

// <h2 className="mb-4">My Interviews 📅</h2>

// {interviews.length===0 && (

// <p>No interviews scheduled</p>

// )}

// {interviews.map((i)=>(

// <div className="card p-3 mb-3" key={i._id}>

// <h5>💼 Job : {i.jobId?.jobTitle}</h5>

// <p>👨‍💼 Employer : {i.employerId?.name}</p>

// <p>📧 Email : {i.employerId?.email}</p>

// <p>📅 Date : {i.date ? new Date(i.date).toLocaleDateString() : "-"}</p>

// <p>⏰ Time : {i.date ? new Date(i.date).toLocaleTimeString() : "-"}</p>

// <p>💻 Mode : {i.mode}</p>

// <p>📍 Location : {i.location || "Online Meeting"}</p>

// <p>📌 Status : {i.status}</p>

// </div>

// ))}

// </div>

// </div>

// );

// };

// export default CandidateInterviews;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const CandidateInterviews = () => {

const [interviews,setInterviews]=useState([]);

const token = localStorage.getItem("token");

const fetchInterviews = async () => {

try{

const res = await axios.get(
"http://localhost:5000/api/getcandidateinterviews",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

setInterviews(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchInterviews();
},[]);


// Accept Interview
const acceptInterview = async(id)=>{

try{

await axios.put(
`http://localhost:5000/api/interview/accept/${id}`,
{},
{
headers:{ Authorization:`Bearer ${token}` }
}
);

fetchInterviews();

}catch(err){
console.log(err);
}

};


// Reject Interview
const rejectInterview = async(id)=>{

try{

await axios.put(
`http://localhost:5000/api/interview/reject/${id}`,
{},
{
headers:{ Authorization:`Bearer ${token}` }
}
);

fetchInterviews();

}catch(err){
console.log(err);
}

};


return(

<div>

<Navbar/>

<div className="container mt-4">

<h2 className="mb-4">My Interviews 📅</h2>

{interviews.length===0 && (
<p>No interviews scheduled</p>
)}

{interviews.map((i)=>(

<div className="card p-3 mb-3 shadow" key={i._id}>

<h5>💼 Job : {i.jobId?.jobTitle}</h5>

<p>👤 Candidate : {i.candidateId?.name}</p>

<p>✉️ Candidate Email : {i.candidateId?.email}</p>

<p>👨‍💼 Employer : {i.employerId?.name}</p>

<p>📧 Employer Email : {i.employerId?.email}</p>

<p>📅 Date : {i.date ? new Date(i.date).toLocaleDateString() : "-"}</p>

<p>⏰ Time : {i.date ? new Date(i.date).toLocaleTimeString() : "-"}</p>

<p>💻 Mode : {i.mode}</p>

<p>📍 Location : {i.location || "Online Meeting"}</p>

<p>📌 Status : {i.status}</p>


{i.status==="scheduled" && (

<div className="mt-2">

<button 
className="btn btn-success me-2"
onClick={()=>acceptInterview(i._id)}
>
Accept
</button>

<button 
className="btn btn-danger"
onClick={()=>rejectInterview(i._id)}
>
Reject
</button>

</div>

)}

</div>

))}

</div>

</div>

);

};

export default CandidateInterviews;