const Venue = require("../models/venue");

// CREATE VENUE (Admin approves a ProviderRequest and calls this)
const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VENUES (with filters)
const getVenues = async (req, res) => {
  try {
    const { location, capacity } = req.query;
    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (capacity) filter.capacity = { $gte: Number(capacity) };

    const venues = await Venue.find(filter);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE VENUE
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VENUE — allow ALL fields including new pricing ones
const updateVenue = async (req, res) => {
  try {
    const allowed = [
      "name",
      "location",
      "description",
      "capacity",
      "pricePerHour",
      "isAvailable",
      "images",
      // legacy single type
      "eventType",
      // new pricing fields
      "eventTypePricing",
      "guestTierPricing",
    ];

    const update = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });

    // Keep legacy eventType in sync with pricing map when admin updates it
    if (
      update.eventTypePricing &&
      typeof update.eventTypePricing === "object"
    ) {
      const keys =
        update.eventTypePricing instanceof Map
          ? [...update.eventTypePricing.keys()]
          : Object.keys(update.eventTypePricing);
      if (keys.length > 0) update.eventType = keys[0];
    }

    const venue = await Venue.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update venue" });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json({ message: "Venue deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete venue" });
  }
};

module.exports = {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
