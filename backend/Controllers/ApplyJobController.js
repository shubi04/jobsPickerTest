

const Application = require("../Model/ApplyJobModel");
const Job = require("../Model/JobModel");

// 🔹 Apply Job (Job Seeker)
const applyJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.jobId;
    const { resume } = req.body;

    const job = await Job.findById(jobId);
    
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ userId, jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      jobId,
      userId,
      employerId: job.employerId,
      resume,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Job Seeker – My Applications
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.userId })
      .populate("jobId", "jobTitle location salaryRange")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const getEmployerApplications = async (req, res) => {
//   try {

//     const jobId = req.params.jobId;

//     const apps = await Application.find({ jobId })
//       .populate("userId", "name email")
//       .populate("jobId", "jobTitle location salaryRange")
//       .sort({ createdAt: -1 });

//     res.status(200).json(apps);

//   } catch (error) {

//     res.status(500).json({ message: error.message });

//   }
// };
const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.userId;

    // Find all applications where employerId matches
    const apps = await Application.find({ employerId })
      .populate("userId", "name email") // applicant info
      .populate("jobId", "jobTitle location salaryRange") // job info
      .sort({ createdAt: -1 });

    res.status(200).json(apps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get applications for a specific job (by jobId)
const getApplicationsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user.userId;

    // Ensure employer owns this job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employerId.toString() !== employerId)
      return res.status(403).json({ message: "Not authorized" });

    // Fetch applications for this job
    const apps = await Application.find({ jobId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req,res)=>{

try{

const { status } = req.body;

const application = await Application.findById(req.params.id);

if(!application){
return res.status(404).json({message:"Application not found"})
}

// 🔐 check employer
if(application.employerId.toString() !== req.user.userId){
return res.status(403).json({message:"Not authorized"})
}

application.status = status;

await application.save();

res.json(application);

}catch(error){

res.status(500).json({message:error.message})

}

}
const getEmployerApplicationsCount = async (req, res) => {
  try {

    const employerId = req.user.userId;

    const count = await Application.countDocuments({ employerId });

    res.json({ totalApplications: count });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// 🗓 Schedule Interview

// Schedule Interview
module.exports = {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getEmployerApplicationsCount,
  getApplicationsByJob,
};