const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  postponeBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ── Screenshot upload setup ──
const screenshotDir = path.join(__dirname, "../uploads/screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, screenshotDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."), false);
    }
  },
});

// USER
router.post("/", protect, upload.single("screenshot"), createBooking);
router.get("/my", protect, getMyBookings);

// ADMIN
router.get("/", protect, authorizeRoles("admin"), getAllBookings);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateBookingStatus,
);
router.put("/:id/postpone", protect, authorizeRoles("admin"), postponeBooking);

// USER or ADMIN — ownership enforced in controller
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
