const JobModel=require("../Model/JobModel");
const createJob = async (req, res) => {
  try {
        if (req.user.role !== "employer") {
  return res.status(403).json({ message: "Only employer can create job" });
}

    const employerId = req.user.userId; // ✅ FIX

    const {
      jobTitle,
      description,
      qualification,
      responsibilities,
      location,
      salaryRange
    } = req.body;

    const job = await JobModel.create({
      employerId,
      jobTitle,
      description,
      qualification,
      responsibilities,
      location,
      salaryRange
    });

    console.log("USER DATA:", req.user);

    res.status(201).json(job);

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// const getJobs=async(req,res)=>{
//     try{
//         const jobs=await JobModel.find().populate("employerId","email");
//         res.status(200).json(jobs);
//             console.log(jobs);
//     }catch(error){
//         res.status(500).json({message:error.message});
//         }
//     }
const getJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    let filter = {};

    if (keyword) {
      filter.$or = [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await JobModel.find(filter)
      .populate("employerId", "email");

    res.status(200).json(jobs); 

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    console.log("JOB ID:", jobId);
    console.log("USER ID:", req.user.id);

    const job = await JobModel.findById(jobId);
    console.log("FOUND JOB:", job);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }



    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedJob = await JobModel.findByIdAndUpdate(
      jobId,
      updates,
      { new: true }
    );

    res.status(200).json(updatedJob);

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

//delete job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ❌ Unauthorized (sirf same employer delete kar sakta hai)
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Delete job
    await JobModel.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
module.exports={createJob,getJobs,updateJob,deleteJob};