const Hotel = require("../models/hotel");

// ─── GET ALL HOTELS ───────────────────────────────────────────────────────────
const getAllHotels = async (req, res) => {
  try {
    const { type, available, search } = req.query;

    const filter = {};

    if (type && type !== "all") filter.type = type;

    if (available === "true") filter.isAvailable = true;
    if (available === "false") filter.isAvailable = false;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE HOTEL ─────────────────────────────────────────────────────────
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CREATE HOTEL (ADMIN) ─────────────────────────────────────────────────────
const createHotel = async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      stars,
      pricePerNight,
      description,
      amenities,
      images,
      isAvailable,
    } = req.body;

    // Basic validation
    if (!name || !location || !type || pricePerNight == null) {
      return res.status(400).json({
        message: "name, location, type, and pricePerNight are required",
      });
    }

    const hotel = await Hotel.create({
      name,
      location,
      type,
      stars: Number(stars) || 3,
      pricePerNight: Number(pricePerNight),
      description: description || "",
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE HOTEL (ADMIN) ─────────────────────────────────────────────────────
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const allowedFields = [
      "name",
      "location",
      "type",
      "stars",
      "pricePerNight",
      "description",
      "amenities",
      "images",
      "isAvailable",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) hotel[field] = req.body[field];
    });

    await hotel.save();
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE HOTEL (ADMIN) ─────────────────────────────────────────────────────
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
