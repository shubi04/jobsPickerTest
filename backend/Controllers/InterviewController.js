// // const Interview = require("../Model/InterviewModel");
// // const Application = require("../Model/ApplyJobModel");

// // // Schedule Interview
// // const scheduleInterview = async (req, res) => {

// //   const { applicationId, date, time, mode, location, notes } = req.body;

// //   try {

// //     const app = await Application.findById(applicationId);

// //     if (!app)
// //       return res.status(404).json({ message: "Application not found" });

// //     // combine date + time
// //     const interviewDateTime = new Date(`${date}T${time}`);

// //     const interview = await Interview.create({
// //       applicationId,
// //       jobId: app.jobId,
// //       employerId: app.employerId,
// //       candidateId: app.userId,
// //       date: interviewDateTime,
// //       mode,
// //       location,
// //       notes
// //     });

// //     app.status = "interview_scheduled";
// //     await app.save();

// //     res.status(201).json(interview);

// //   } catch (error) {

// //     console.log(error);
// //     res.status(500).json({ message: "Server Error" });

// //   }
// // };

// // // Get interviews by employer


// // const getEmployerInterviews = async (req, res) => {

// //   const employerId = req.user.id;

// //   try {

// //     const interviews = await Interview.find({ employerId })
// //       .populate({
// //         path:"candidateId",
// //         select:"name email"
// //       })
// //       .populate({
// //         path:"jobId",
// //         select:"jobTitle"
// //       });

// //     res.json(interviews);

// //   } catch (error) {

// //     console.log(error);
// //     res.status(500).json({ message: "Server Error" });

// //   }
// // };

// // const getCandidateInterviews = async (req,res)=>{

// //  const candidateId=req.user.id;

// //  try{

// //  const interviews=await Interview.find({candidateId})
// //  .populate("jobId","jobTitle")
// //  .populate("employerId","name email");

// //  res.json(interviews);

// //  }catch(error){

// //  res.status(500).json({message:"Server Error"})

// //  }

// // }
// // module.exports={scheduleInterview,getEmployerInterviews,getCandidateInterviews}


// const Interview = require("../Model/InterviewModel");
// const Application = require("../Model/ApplyJobModel");
// const mongoose = require("mongoose");

// // Schedule Interview
// const scheduleInterview = async (req, res) => {

//   const { applicationId, date, time, mode, location, notes } = req.body;

//   try {

//     const app = await Application.findById(applicationId);

//     if (!app) {
//       return res.status(404).json({ message: "Application not found" });
//     }

//     // combine date + time
//     const interviewDateTime = new Date(`${date}T${time}`);

//     const interview = await Interview.create({
//       applicationId,
//       jobId: app.jobId,
//       employerId: app.employerId,
//       candidateId: app.userId,
//       date: interviewDateTime,
//       mode,
//       location,
//       notes
//     });

//     // update application status
//     app.status = "interview_scheduled";
//     await app.save();

//     res.status(201).json({
//       message: "Interview scheduled successfully",
//       interview
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// // Employer Interviews

// const getEmployerInterviews = async (req, res) => {

// const employerId = req.user.id;

// try{

// const interviews = await Interview.find({ employerId })
// .populate("candidateId","name email")
// .populate("jobId","jobTitle");

// console.log(interviews);

// res.json(interviews);

// }
// catch(error){

// console.log(error);
// res.status(500).json({message:"Server Error"});

// }

// };
// // Candidate Interviews
// const getCandidateInterviews = async (req, res) => {

//   const candidateId = req.user.id;

//   try {

//     const interviews = await Interview.find({ candidateId })
//       .populate("jobId", "jobTitle")
//       .populate("employerId", "name email");

//     res.json(interviews);

//   } catch (error) {

//     console.log(error);
//     res.status(500).json({ message: "Server Error" });

//   }

// };

// module.exports = {
//   scheduleInterview,
//   getEmployerInterviews,
//   getCandidateInterviews
// };

const Interview = require("../Model/InterviewModel");
const Application = require("../Model/ApplyJobModel");

// Schedule Interview
const scheduleInterview = async (req, res) => {

  try {

    const { applicationId, date, time, mode, location, notes } = req.body;

    const app = await Application.findById(applicationId);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const interviewDateTime = new Date(`${date}T${time}`);

    const interview = await Interview.create({
      applicationId,
      jobId: app.jobId,
      employerId: app.employerId,
      candidateId: app.userId,
      date: interviewDateTime,
      mode,
      location,
      notes
    });

    // update application status
    app.status = "interview_scheduled";
    await app.save();

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" });

  }
};



// Employer Interviews
const getEmployerInterviews = async (req, res) => {

  try {

    const employerId = req.user.userId;   // ✅ employer from token

    const interviews = await Interview.find({ employerId })
      .populate("candidateId", "name email")
      .populate("jobId", "jobTitle");

    console.log("Interviews:", interviews);

    res.json(interviews);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" });

  }

};



// Candidate Interviews
const getCandidateInterviews = async (req, res) => {

  try {

    const candidateId = req.user.userId;

    const interviews = await Interview.find({ candidateId })
      .populate("jobId", "jobTitle")
      .populate("employerId", "name email")
      .populate("candidateId", "name email");   // ⭐ ye add karo

    res.json(interviews);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" });

  }

};

const acceptInterview = async(req,res)=>{

const interview = await Interview.findByIdAndUpdate(
req.params.id,
{status:"accepted"},
{new:true}
);

res.json(interview);

};

const rejectInterview = async(req,res)=>{

const interview = await Interview.findByIdAndUpdate(
req.params.id,
{status:"rejected"},
{new:true}
);

res.json(interview);

};
module.exports = {
  scheduleInterview,
  getEmployerInterviews,
  getCandidateInterviews,
  rejectInterview,
  acceptInterview
};