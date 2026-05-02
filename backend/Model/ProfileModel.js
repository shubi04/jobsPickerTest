const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user id ya email
  email: { type: String, required: true, unique: true },
  name: { type: String },
  contactNo: { type: String },
  location: { type: String },
  skills: { type: String },
  experience: { type: String },
  education: { type: String },
  about: { type: String },
  pic: { type: String },    
  resume: { type: String }, 
  role: {
  type: String,
  enum: ["jobseeker", "employer"]
}
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);