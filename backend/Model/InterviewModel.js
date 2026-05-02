const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status:{
    type:String,
    enum:["scheduled","accepted","rejected"],
    default:"scheduled"
  },
  mode: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  location: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);