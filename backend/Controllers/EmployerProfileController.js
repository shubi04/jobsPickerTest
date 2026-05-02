const EmployerProfileModel=require("../Model/EmployeeProfileModel")
const ProfileModel=require("../Model/ProfileModel")
const createEmployerProfile = async (req, res) => {
  try {
    const email = req.user.email; // ✅ yahan se lo
    const {name}=req.body;

    const existing = await EmployerProfileModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new EmployerProfileModel({
      name,
      email,
      user: req.user.userId, // optional
      ...req.body,
    });

    await profile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });

  } catch (err) {
    console.log("ERROR:", err); // 👈 DEBUG
    res.status(500).json({ message: err.message });
  }
};

const getEmployerProfile = async (req, res) => {
  try {

    const email = req.user.email;

    // first check job seeker profile
    let profile = await ProfileModel.findOne({ email });

    // agar nahi mila to employer profile check karo
    if (!profile) {
      profile = await EmployerProfileModel.findOne({ email });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployerProfile = async (req, res) => {

  try {

    const email = req.user.email;   // token se email
    const updates = req.body;

    const profile = await EmployerProfileModel.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.keys(updates).forEach((key) => {

      // email change nahi karne dena
      if (key === "email") return;

      // blank value update nahi hogi
      if (updates[key] !== undefined && updates[key] !== "") {
        profile[key] = updates[key];
      }

    });

    await profile.save();

    res.status(200).json({
      message: "Employer profile updated successfully",
      profile
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


module.exports={createEmployerProfile,getEmployerProfile,updateEmployerProfile}