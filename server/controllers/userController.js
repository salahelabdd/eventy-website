const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp, saveOtp, verifyOtp } = require("../utils/otp");
const { sendVerificationEmail } = require("../utils/mailer");

// ─────────────────────────────────────────
// Step 1: Send OTP to email before register
// POST /api/users/send-otp
// ─────────────────────────────────────────
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const code = generateOtp();
    saveOtp(`verify_${email}`, code);

    // ⚡ IMPORTANT: do NOT block response on email sending
    sendVerificationEmail(email, code, "verify")
      .then(() => console.log("OTP email sent"))
      .catch((err) => console.error("Email error:", err));

    return res.json({ message: "Verification code sent." });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({
      message: "Failed to send verification email. Please try again.",
    });
  }
};
// ─────────────────────────────────────────
// Step 2: Verify OTP then create the user
// POST /api/users/verify-and-register
// ─────────────────────────────────────────
const verifyAndRegister = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, code, role } = req.body;

    // Validate OTP first
    const result = verifyOtp(`verify_${email}`, code);
    if (!result.valid) {
      return res.status(400).json({ message: result.reason });
    }

    // Required fields
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    // Password rules
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter.",
      });
    }

    // Double-check email not taken (race condition guard)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role || "customer",
    });

    res.status(201).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// Login
// ─────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// Forgot password — send reset code
// ─────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a reset code has been sent.",
      });
    }

    const code = generateOtp();
    saveOtp(`reset_${email}`, code);

    sendVerificationEmail(email, code, "reset")
      .then(() => console.log("Reset email sent to", email))
      .catch((err) => console.error("Reset email error:", err));

    res.json({ message: "If this email exists, a reset code has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res
      .status(500)
      .json({ message: "Could not send reset code. Please try again." });
  }
};

// ─────────────────────────────────────────
// Reset password — verify code + update
// ─────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const result = verifyOtp(`reset_${email}`, code);
    if (!result.valid) {
      return res.status(400).json({ message: result.reason });
    }

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one uppercase letter.",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Reset failed. Please try again." });
  }
};

// ─────────────────────────────────────────
// Profile
// ─────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      if (!/[A-Z]/.test(req.body.password)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyAndRegister,
  loginUser,
  updateProfile,
  getMe,
  getAllUsers,
  forgotPassword,
  resetPassword,
};
