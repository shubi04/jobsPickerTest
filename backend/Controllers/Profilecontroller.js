const ProfileModel = require("../Model/ProfileModel");

// ✅ CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    const {name, email, ...rest } = req.body;

    const existing = await ProfileModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new ProfileModel({
      name,
      email,
      user: email,
      ...rest,
    });

    await profile.save();

    res.status(201).json({ message: "Profile created successfully", profile });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PROFILE

// ✅ GET PROFILE
const getProfile = async (req, res) => {
  try {
    const email = req.user.email; // token se email

    const profile = await ProfileModel.findOne({ email });

    res.status(200).json({ profile });  

  } catch {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {

    const email = req.user.email;   // ✅ token se email
    const updates = req.body;       // ✅ updates yaha se aayenge

    const profile = await ProfileModel.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.keys(updates).forEach((key) => {

      if (key === "email") return;

      if (updates[key] !== undefined && updates[key] !== "") {
        profile[key] = updates[key];
      }

    });

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { createProfile, updateProfile, getProfile };