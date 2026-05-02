import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import EmployerSignup from './EmployerSignup'
import VerifyOtp from './Verifyotp'
import Jobseekerprofile from './Jobseekerprofile'
import HomePage from './Home'
import CreateJob from './CreateJob'
import GetAllJobs from './GetAllJobs'
import GetProfile from './GetProfile'
import LandingPage from './LandingPage'
import EmployerProfile from './EmployerProfile'
import MyApplications from './Pages/MyApplication'
import Dashboard from './Pages/Dashboard'
import Review from './Pages/ReviewPage'
import ScheduleInterview from './Pages/Interview'
import AboutUs from './About'
import ContactUs from './Pages/Contact'
import EmployerApplications from './Pages/EmployerApplication'
import EmployerInterviews from './Pages/EmployerInterviews'
import CandidateInterviews from './Pages/CandidateInterview'

const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutUs/>}/>
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/employer-signup" element={<EmployerSignup/>}/>
        <Route path="/verifyotp" element={<VerifyOtp/>}/>
        <Route path="/jobseeker-profile" element={<Jobseekerprofile/>}/>
                <Route path="/updateprofile" element={<Jobseekerprofile/>}/>

        <Route path="/employer-profile" element={<EmployerProfile/>}/>
                <Route path="/updateemployer-profile" element={<EmployerProfile/>}/>

        <Route path="/getprofile" element={<GetProfile/>}/>
                <Route path="/getemployerprofile" element={<GetProfile/>}/>

        <Route path="/createjob" element={<CreateJob/>}/>
        <Route path="/getalljobs" element={<GetAllJobs/>}/>
        <Route path="/updatejob/:id" element={<CreateJob/>}/>
                <Route path="/deletejob/:id" element={<GetAllJobs/>}/>
                <Route path="/myapplications" element={<MyApplications/>}/>
                                <Route path="/employerapplications" element={<EmployerApplications/>}/>

                                <Route path="/employerapplications/:id" element={<EmployerApplications/>}/>

                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/addreview"element={<Review/>}/>
                <Route path="/scheduleinterview" element={<ScheduleInterview/>}/>
<Route path="/getemployerinterviews" element={<EmployerInterviews/>}/>
<Route path="/getcandidateinterviews" element={<CandidateInterviews/>}/>
 

      </Routes>

    </BrowserRouter>
  )
}

export default App