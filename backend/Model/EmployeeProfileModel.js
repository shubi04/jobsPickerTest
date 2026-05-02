const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  user: { type: String, required: true }, 
  name:{
    type:String,
    required:true,
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  companyName: { 
    type: String, 
    required: true 
  },

  contactNo: { type: String },

  location: { type: String },

  industry: { type: String },

  companySize: { type: String }, 

  website: { type: String },

  description: { type: String },

  logo: { type: String }, // Cloudinary URL

}, { timestamps: true });

module.exports = mongoose.model("Employer", EmployerSchema);