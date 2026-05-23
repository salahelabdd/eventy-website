const HotelBooking = require("../models/HotelBooking");
const Hotel = require("../models/hotel");
const path = require("path");
const fs = require("fs");

// ─── Helper ───────────────────────────────────────────────────────────────────
const isHotelAvailable = async (
  hotelId,
  checkIn,
  checkOut,
  excludeId = null,
) => {
  const conflict = await HotelBooking.findOne({
    hotel: hotelId,
    status: { $nin: ["cancelled", "rejected"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
    ...(excludeId && { _id: { $ne: excludeId } }),
  });
  return conflict === null;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
// Replace the destructuring + create block in createHotelBooking:

const createHotelBooking = async (req, res) => {
  try {
    const {
      hotel,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      roomCategoryId,
      roomCategoryName,
      bedType,
      floorPreference,
      mealPlanId,
      mealPlanName,
      specialRequests,
      paymentMethod,
      totalAmount,
      depositPct,
      depositAmount,
      roomPricePerNight,
      mealPlanTotal,
      addonsTotal,
    } = req.body;

    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) return res.status(404).json({ message: "Hotel not found" });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate)
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });

    const computedNights =
      nights || Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pct = Number(depositPct) || 25;
    const total = Number(totalAmount) || 0;
    const deposit =
      depositAmount != null
        ? Number(depositAmount)
        : Math.ceil(total * (pct / 100));

    let screenshotUrl = "";
    if (req.file) {
      const uploadDir = path.join(__dirname, "../uploads/screenshots");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s/g, "_")}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      screenshotUrl = `/uploads/screenshots/${filename}`;
    }

    const booking = await HotelBooking.create({
      user: req.user._id,
      hotel,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: computedNights,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      roomCategoryId: roomCategoryId || "",
      roomCategoryName: roomCategoryName || "",
      bedType: bedType || "Double",
      floorPreference: floorPreference || "No preference",
      mealPlanId: mealPlanId || "",
      mealPlanName: mealPlanName || "",
      addons: [],
      specialRequests: Array.isArray(specialRequests) ? specialRequests : [],
      paymentMethod: paymentMethod || "credit_card",
      roomPricePerNight: Number(roomPricePerNight) || 0,
      mealPlanTotal: Number(mealPlanTotal) || 0,
      addonsTotal: Number(addonsTotal) || 0,
      totalAmount: total,
      depositPct: pct,
      depositAmount: deposit,
      remainingAmount: total - deposit,
      screenshotUrl,
    });

    await booking.populate("hotel", "name location stars pricePerNight");
    res.status(201).json(booking);
  } catch (error) {
    console.error("Hotel booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY BOOKINGS (USER) ───────────────────────────────────────────────────
const getMyHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ user: req.user._id })
      .populate("hotel", "name location stars pricePerNight images")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL BOOKINGS (ADMIN) ─────────────────────────────────────────────────
const getAllHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find()
      .populate("user", "fullName email")
      .populate("hotel", "name location stars")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE BOOKING ───────────────────────────────────────────────────────
const getHotelBookingById = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id)
      .populate("hotel", "name location stars pricePerNight")
      .populate("user", "fullName email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE STATUS (ADMIN) ────────────────────────────────────────────────────
const updateHotelBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await HotelBooking.findById(req.params.id)
      .populate("hotel")
      .populate("user", "fullName email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status === "confirmed") {
      const available = await isHotelAvailable(
        booking.hotel._id,
        booking.checkIn,
        booking.checkOut,
        booking._id,
      );
      if (!available)
        return res.status(409).json({
          message: "Cannot confirm: hotel already booked for these dates",
        });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE BOOKING FIELDS (ADMIN) ───────────────────────────────────────────
const updateHotelBooking = async (req, res) => {
  try {
    // ✅ Use findById + save instead of findOneAndUpdate to avoid deprecated option
    const booking = await HotelBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const allowed = [
      "guestName",
      "guestEmail",
      "guestPhone",
      "checkIn",
      "checkOut",
      "adults",
      "children",
      "roomType",
      "roomNumber",
      "status",
      "specialRequests",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) booking[key] = req.body[key];
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("updateHotelBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE BOOKING (ADMIN) ───────────────────────────────────────────────────
const deleteHotelBooking = async (req, res) => {
  try {
    const booking = await HotelBooking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("deleteHotelBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── CANCEL BOOKING (USER or ADMIN) ──────────────────────────────────────────
const cancelHotelBooking = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    )
      return res.status(403).json({ message: "Not authorized" });

    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking is already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    const populated = await booking.populate([
      { path: "hotel", select: "name location" },
      { path: "user", select: "fullName email" },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHotelBooking,
  getMyHotelBookings,
  getAllHotelBookings,
  getHotelBookingById,
  updateHotelBookingStatus,
  updateHotelBooking,
  deleteHotelBooking,
  cancelHotelBooking,
};
