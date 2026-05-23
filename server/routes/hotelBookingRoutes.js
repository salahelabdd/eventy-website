const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }); // or diskStorage if you save files

const {
  createHotelBooking,
  getMyHotelBookings,
  getAllHotelBookings,
  getHotelBookingById,
  updateHotelBookingStatus,
  updateHotelBooking,
  deleteHotelBooking,
  cancelHotelBooking,
} = require("../controllers/hotelBookingController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// USER
router.post("/", protect, upload.single("screenshot"), createHotelBooking); // ← added multer
router.get("/my", protect, getMyHotelBookings);

// ADMIN
router.get("/", protect, authorizeRoles("admin"), getAllHotelBookings);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateHotelBookingStatus,
);

router.put("/:id", protect, authorizeRoles("admin"), updateHotelBooking); // ← add
router.delete("/:id", protect, authorizeRoles("admin"), deleteHotelBooking); // ← add

// USER or ADMIN
router.get("/:id", protect, getHotelBookingById);
router.put("/:id/cancel", protect, cancelHotelBooking);

module.exports = router;
