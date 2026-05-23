const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const Service = require("../models/Service");
const { sendInvitationEmail } = require("../utils/emailService");
const { calculateTotal } = require("../utils/pricingUtils");

// ─── Helper ───────────────────────────────────────────────────────────────────
const isVenueAvailable = async (
  venueId,
  eventDate,
  excludeBookingId = null,
) => {
  const dayStart = new Date(eventDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(eventDate);
  dayEnd.setHours(23, 59, 59, 999);

  const conflict = await Booking.findOne({
    venue: venueId,
    eventDate: { $gte: dayStart, $lte: dayEnd },
    status: "accepted",
    ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
  });
  return conflict === null;
};

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const {
      venue: venueId,
      eventType,
      guestCount,
      eventDate,
      hours,
      paymentMethod,
      depositPct,
    } = req.body;

    // These arrive as JSON strings when sent as multipart/form-data
    const services = JSON.parse(req.body.services || "[]");
    const invites = JSON.parse(req.body.invites || "[]");

    // Screenshot uploaded via multer
    const screenshotUrl = req.file
      ? `/uploads/screenshots/${req.file.filename}`
      : null;

    // 1. Venue exists?
    const venueDoc = await Venue.findById(venueId);
    if (!venueDoc) return res.status(404).json({ message: "Venue not found" });

    // 2. Capacity check
    if (Number(guestCount) > venueDoc.capacity)
      return res
        .status(400)
        .json({ message: "Guest count exceeds venue capacity" });

    // 3. Double-booking guard (pending OR accepted both block the date)
    const dayStart = new Date(eventDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(eventDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      venue: venueId,
      eventDate: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ["cancelled", "rejected"] },
    });
    if (existingBooking)
      return res
        .status(400)
        .json({ message: "Venue already booked on this date" });

    // 4. Resolve service documents for server-side price calculation
    //    (never trust the client's price values)
    const serviceIds = Array.isArray(services) ? services : [];
    const serviceDocs = serviceIds.length
      ? await Service.find({ _id: { $in: serviceIds } }).select("price")
      : [];

    // 5. ── Server-side price calculation ─────────────────────────────────────
    //    Uses the same logic as the frontend (pricingUtils.js).
    //    The client's totalAmount / depositAmount are IGNORED here.
    const pricing = calculateTotal({
      pricePerHour: venueDoc.pricePerHour,
      hours: Number(hours) || 1,
      guestCount: Number(guestCount) || 0,
      eventType,
      eventTypePricing: venueDoc.eventTypePricing,
      guestTierPricing: venueDoc.guestTierPricing,
      serviceObjects: serviceDocs,
    });

    const resolvedDepositPct = Math.min(
      100,
      Math.max(25, Number(depositPct) || 25),
    );
    const depositAmount = Math.round(
      (pricing.total * resolvedDepositPct) / 100,
    );
    const remainingAmount = pricing.total - depositAmount;

    // 6. Create
    const booking = await Booking.create({
      user: req.user._id,
      venue: venueId,
      eventType,
      guestCount: Number(guestCount),
      eventDate,
      hours: Number(hours) || 1,
      services: serviceIds,
      invites: Array.isArray(invites) ? invites : [],
      paymentMethod: paymentMethod || "credit_card",

      // Pricing breakdown — stored for receipts / admin views
      baseCost: pricing.baseCost,
      eventMultiplier: pricing.eventMultiplier,
      guestMultiplier: pricing.guestMultiplier,
      guestTierLabel: pricing.guestTierLabel,
      adjustedVenueCost: pricing.adjustedVenueCost,
      servicesTotal: pricing.servicesTotal,
      totalAmount: pricing.total,

      depositPct: resolvedDepositPct,
      depositAmount,
      remainingAmount,
      screenshotUrl,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET USER BOOKINGS ────────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("venue")
      .populate("services");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL BOOKINGS (ADMIN) ─────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "fullName email")
      .populate("venue");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE BOOKING STATUS (ADMIN) ───────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("venue")
      .populate("user", "fullName email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status === "accepted") {
      const available = await isVenueAvailable(
        booking.venue._id,
        booking.eventDate,
        booking._id,
      );
      if (!available)
        return res.status(409).json({
          message:
            "Cannot accept: venue is already booked on this date by another reservation",
        });
    }

    booking.status = status;
    await booking.save();

    if (status === "accepted") {
      const recipients = [];

      if (booking.user?.email)
        recipients.push({
          to: booking.user.email,
          name: booking.user.fullName,
          isOwner: true,
          inviterName: null,
        });

      booking.invites?.forEach((email) =>
        recipients.push({
          to: email,
          name: null,
          isOwner: false,
          inviterName: booking.user?.fullName,
        }),
      );

      recipients.forEach(({ to, name, isOwner, inviterName }) =>
        sendInvitationEmail({
          to,
          guestName: name,
          booking,
          isOwner,
          inviterName,
        }).catch((err) =>
          console.error(`Failed to send invite to ${to}:`, err.message),
        ),
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POSTPONE BOOKING (ADMIN) ─────────────────────────────────────────────────
const postponeBooking = async (req, res) => {
  try {
    const { newDate } = req.body;
    if (!newDate)
      return res.status(400).json({ message: "newDate is required" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled")
      return res
        .status(400)
        .json({ message: "Cannot postpone a cancelled booking" });

    const available = await isVenueAvailable(
      booking.venue,
      new Date(newDate),
      booking._id,
    );
    if (!available)
      return res
        .status(409)
        .json({ message: "The new date is already booked for this venue" });

    booking.eventDate = new Date(newDate);
    await booking.save();

    const populated = await booking.populate([
      { path: "venue" },
      { path: "user", select: "fullName email" },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CANCEL BOOKING (USER or ADMIN) ──────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
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
      { path: "venue" },
      { path: "user", select: "fullName email" },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  postponeBooking,
  cancelBooking,
};
