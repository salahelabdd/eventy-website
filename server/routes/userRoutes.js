const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyAndRegister,
  loginUser,
  updateProfile,
  getMe,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ── Auth ──────────────────────────────────
router.post("/send-otp", sendOtp); // Step 1: send email OTP
router.post("/register", verifyAndRegister); // Step 2: verify OTP + create account
router.post("/login", loginUser);

// ── Password reset ────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── Protected ────────────────────────────
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.get("/profile", protect, (req, res) => res.json(req.user));
router.get("/admin-test", protect, authorizeRoles("admin"), (req, res) =>
  res.json({ message: "Welcome Admin" }),
);
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;
