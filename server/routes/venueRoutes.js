const express = require("express");
const router = express.Router();

const {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("admin", "provider"), createVenue);
router.get("/", getVenues);
router.get("/:id", getVenueById);
router.put("/:id", protect, authorizeRoles("admin"), updateVenue);
router.delete("/:id", protect, authorizeRoles("admin"), deleteVenue);

module.exports = router;
