const {registerUser,loginUser, sendOtp, verifyOtp} = require("../Controllers/Usercontroller");
const {createProfile,updateProfile, getProfile}=require("../Controllers/Profilecontroller")
const express=require('express');
const authMiddleware = require("../authMiddleware");
const {createEmployerProfile, getEmployerProfile, updateEmployerProfile} = require("../Controllers/EmployerProfileController");
const { createJob, getJobs, updateJob, deleteJob } = require("../Controllers/Jobcontroller");
const { applyJob, getMyApplications, getEmployerApplications, updateApplicationStatus, getEmployerApplicationsCount, getApplicationsByJob } = require("../Controllers/ApplyJobController");
const { addReview, getReviews } = require("../Controllers/ReviewController");
const { scheduleInterview, getEmployerInterviews, getCandidateInterviews, acceptInterview, rejectInterview } = require("../Controllers/InterviewController");
const router=express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser)
router.post('/sendotp',sendOtp)
router.post('/verifyotp',verifyOtp)
router.post("/createprofile",  createProfile);
router.put("/updateprofile",authMiddleware,updateProfile);
router.get("/getprofile",authMiddleware, getProfile);
router.get("/getemployerprofile",authMiddleware,getEmployerProfile);
router.post("/createemployerprofile",authMiddleware,createEmployerProfile);
router.put("/updateemployerprofile",authMiddleware,updateEmployerProfile);
router.post("/createjob",authMiddleware,createJob)
router.get("/getjobs",getJobs)
router.put("/updatejob/:id",authMiddleware,updateJob)
router.delete("/deletejob/:id",authMiddleware,deleteJob)

router.post("/applyjob/:jobId",authMiddleware,applyJob)
router.get("/myapplications",authMiddleware,getMyApplications)
router.post("/addreview",authMiddleware,addReview)
router.get("/getreviews/:email",authMiddleware,getReviews)
// router.get("/employerapplications/:jobId", authMiddleware, getEmployerApplications);
 router.get("/employerapplications", authMiddleware, getEmployerApplications);
 // routes/applicationRoutes.js
router.get("/employerapplications/:jobId", authMiddleware, getApplicationsByJob
);


router.put("/updateapplication/:id", authMiddleware, updateApplicationStatus);
router.get("/employerapplicationscount", authMiddleware, getEmployerApplicationsCount);
router.post("/scheduleinterview", authMiddleware,scheduleInterview);
router.get("/getemployerinterviews",authMiddleware,getEmployerInterviews)
router.get("/getcandidateinterviews",authMiddleware, getCandidateInterviews)
router.put("/interview/accept/:id", authMiddleware, acceptInterview);
router.put("/interview/reject/:id", authMiddleware, rejectInterview);


// Get my applications (Jobseeker)

module.exports=router