const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
    userEmail: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);