const express = require("express");
const router = express.Router();

const Review = require("../models/ReviewModel");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

//
// ADD REVIEW
//
router.post("/", protect, async (req, res) => {
  try {
    const { event, text, rating, anonymous } = req.body;

    const review = await Review.create({
      user: req.user._id,
      event,
      text,
      rating,
      anonymous: !!anonymous,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
// GET REVIEWS
//
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
// DELETE REVIEW (admin only)
//
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
