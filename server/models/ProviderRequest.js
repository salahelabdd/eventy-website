const mongoose = require("mongoose");

const guestTierSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    multiplier: { type: Number, required: true, default: 1.0 },
    label: { type: String, required: true },
  },
  { _id: false },
);

const providerRequestSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["venue", "hotel", "service"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // ── Shared ──────────────────────────────────────────────
    name: { type: String },
    location: { type: String },
    description: { type: String },

    // ── Venue fields ─────────────────────────────────────────
    capacity: { type: Number },
    pricePerHour: { type: Number },
    isAvailable: { type: Boolean, default: true },

    // legacy single eventType kept for backward compat
    eventType: { type: String },

    // NEW: multi-type pricing map  e.g. { wedding: 1.5, corporate: 1.2 }
    eventTypePricing: {
      type: Map,
      of: Number,
      default: undefined, // not set → admin panel falls back to Venue model defaults
    },

    // NEW: guest tier brackets
    guestTierPricing: {
      type: [guestTierSchema],
      default: undefined,
    },

    // NEW: image URLs
    images: {
      type: [String],
      default: [],
    },

    // ── Hotel fields ─────────────────────────────────────────
    stars: { type: Number },
    pricePerNight: { type: Number },
    totalRooms: { type: Number },
    amenities: [{ type: String }],

    // NEW rich hotel fields
    roomCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
    mealPlans: { type: mongoose.Schema.Types.Mixed, default: [] },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    cancellationPolicy: { type: String },
    contactPhone: { type: String },
    website: { type: String },
    petFriendly: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    // ── Service fields ────────────────────────────────────────
    category: { type: String },
    price: { type: Number },
    priceUnit: {
      type: String,
      enum: ["flat", "per_hour", "per_person", "per_day"],
    },
    contactEmail: { type: String },

    // ── Admin ─────────────────────────────────────────────────
    adminNote: { type: String, default: "" },
    rejectionReason: { type: String, default: null },  // ← add this
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ProviderRequest ||
  mongoose.model("ProviderRequest", providerRequestSchema);
