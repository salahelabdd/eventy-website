const Payment = require("../models/payment");
const Booking = require("../models/Booking");
const Venue = require("../models/venue");

const createPayment = async (req, res) => {
  try {
    const { bookingId, method, hours } = req.body;

    if (!bookingId || !method || !hours) {
      return res.status(400).json({
        message: "Missing bookingId, method, or hours",
      });
    }

    const totalHours = Number(hours);

    if (isNaN(totalHours) || totalHours <= 0) {
      return res.status(400).json({
        message: "Invalid hours value",
      });
    }

    const booking = await Booking.findById(bookingId.trim()).populate("venue");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const amount = booking.venue.pricePerHour * totalHours;

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount,
      method,
      status: "paid",
    });

    booking.status = "confirmed";
    await booking.save();

    res.status(201).json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER PAYMENTS
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate(
      "booking",
    );

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
};
