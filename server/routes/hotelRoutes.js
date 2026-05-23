const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotel");

const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllHotels);
router.get("/:id", getHotelById);

// ── Admin: bulk insert MUST come before POST / ────────────────────────────────
router.post("/bulk", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0)
      return res
        .status(400)
        .json({ message: "Body must be a non-empty array" });

    const hotels = await Hotel.insertMany(req.body, { ordered: false });
    res.status(201).json({ inserted: hotels.length, hotels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: single ─────────────────────────────────────────────────────────────
router.post("/", protect, authorizeRoles("admin"), createHotel);
router.put("/:id", protect, authorizeRoles("admin"), updateHotel);
router.delete("/:id", protect, authorizeRoles("admin"), deleteHotel);

module.exports = router;
