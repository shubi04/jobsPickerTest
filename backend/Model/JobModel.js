const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salaryRange: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);