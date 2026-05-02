import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [contactNo,setContactNo] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [loading,setLoading] = useState(false);

const navigate = useNavigate();
const token = localStorage.getItem("token");

useEffect(()=>{
if(token){
navigate("/");
}
},[]);

const handleSubmit = async (e)=>{
e.preventDefault();

const passwordRegex =
/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(!passwordRegex.test(password)){
alert("Password must contain 8 characters, 1 uppercase, 1 number and 1 special symbol");
return;
}

if(!/^\d{10}$/.test(contactNo)){
alert("Contact number must be 10 digits");
return;
}

setLoading(true);

try{

await axios.post("http://localhost:5000/api/register",{
name,
email,
password,
role:"jobseeker",
contactNo
});

alert("Signup successful ✅");
navigate("/verifyotp",{state:{email}});

}catch(error){
alert(error.response?.data?.message || "Signup failed ❌");
}

setLoading(false);
};

return (

<div
className="d-flex justify-content-center align-items-center"
style={{
height:"100vh",
background:"linear-gradient(135deg,#ff9a9e,#89CFF0)"
}}
>

<form
onSubmit={handleSubmit}
className="shadow-lg p-4"
style={{
width:"420px",
borderRadius:"15px",
background:"#fff"
}}
>

<h2 className="text-center text-dark fw-bold mb-3">
Sign Up 🚀
</h2>

<p className="text-center text-muted mb-4">
Create your account to get started
</p>

<input
type="text"
className="form-control mb-3"
placeholder="Enter your name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<input
type="email"
className="form-control mb-3"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<div className="mb-3">

<div className="input-group">

<input
type={showPassword ? "text":"password"}
className="form-control"
placeholder="Enter password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
type="button"
className="btn btn-outline-secondary"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "Hide":"Show"}
</button>

</div>

<small className="text-muted">
Password must contain 8 characters, 1 uppercase, 1 number & 1 special symbol
</small>

</div>

<input
type="text"
className="form-control mb-3"
placeholder="Enter contact number"
maxLength="10"
value={contactNo}
onChange={(e)=>setContactNo(e.target.value.replace(/[^0-9]/g,""))}
required
/>

<button
className="btn btn-primary w-100"
disabled={loading}
>
{loading ? "Signing up..." : "Signup"}
</button>

<p className="text-center mt-3 text-dark">
Already have an account?
<span
onClick={()=>navigate("/login")}
className="fw-bold text-primary ms-1"
style={{cursor:"pointer"}}
>
Login
</span>
</p>

</form>

</div>

);
};

export default Signup;