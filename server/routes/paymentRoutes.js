const express = require("express");
const router = express.Router();

const {
  createPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// create payment
router.post("/", protect, createPayment);

// get my payments
router.get("/my", protect, getMyPayments);

module.exports = router;
