const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const venueRoutes = require("./routes/venueRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const hotelBookingRoutes = require("./routes/hotelBookingRoutes");
const providerRoutes = require("./routes/providerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://eventy-website.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test-email", async (req, res) => {
  const nodemailer = require("nodemailer");

  console.log("BREVO_USER:", process.env.BREVO_USER);
  console.log("BREVO_PASS:", process.env.BREVO_PASS ? "exists" : "MISSING");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Eventy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Brevo Test",
      text: "If you see this, Brevo is working.",
    });
    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-bookings", hotelBookingRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/reviews", reviewRoutes);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/", (req, res) => {
  res.send("Eventy Server Running 🚀");
});

// Error handler (IMPORTANT for debugging OTP issues)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
