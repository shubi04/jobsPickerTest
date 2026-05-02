const Review=require("../Model/ReviewModel")
const addReview = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { companyId, rating, comment } = req.body;

    const userEmail = req.user?.email;

    if (!companyId || !userEmail || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Review.findOne({ companyId, userEmail });
    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = new Review({
      companyId,
      userEmail,
      rating: Number(rating),
      comment,
    });

    await review.save();

    res.json({ message: "Review added successfully ✅" });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET REVIEWS + AVG
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      companyId: req.params.email,
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addReview, getReviews };