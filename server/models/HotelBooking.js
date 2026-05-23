const mongoose = require("mongoose");

/* ─────────────────────────────────────────────
   Sub-schemas
───────────────────────────────────────────── */

/** One room category (Standard, Deluxe, Suite, Presidential, …) */
const roomCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // e.g. "standard"
    name: { type: String, required: true }, // e.g. "Standard Room"
    description: { type: String, default: "" },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxOccupancy: { type: Number, default: 2 },
    bedOptions: {
      type: [String],
      enum: ["Single", "Double", "Queen", "King", "Twin"],
      default: ["Double"],
    },
    amenities: { type: [String], default: [] }, // room-level amenities
    images: { type: [String], default: [] },
    totalRooms: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false },
);

/** Meal / board plan */
const mealPlanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // e.g. "breakfast"
    name: { type: String, required: true }, // e.g. "Bed & Breakfast"
    description: { type: String, default: "" },
    pricePerPersonPerNight: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false },
);

/* ─────────────────────────────────────────────
   Hotel schema
───────────────────────────────────────────── */
const hotelSchema = new mongoose.Schema(
  {
    /* ── Identity ── */
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, default: 3 },
    description: { type: String, default: "" },

    /* ── Provider / status ── */
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isAvailable: { type: Boolean, default: true },

    /* ── Images ── */
    images: { type: [String], default: [] },

    /* ── Room categories (replaces flat pricePerNight + totalRooms) ── */
    roomCategories: { type: [roomCategorySchema], default: [] },

    /**
     * Kept for backward-compat / quick display.
     * Set automatically to the lowest roomCategory price on save.
     */
    pricePerNight: { type: Number, default: 0 },
    totalRooms: {
      type: Number,
      default: 0,
      // sum of all roomCategory.totalRooms, computed on save
    },

    /* ── Hotel-wide amenities ── */
    amenities: { type: [String], default: [] },

    /* ── Meal / board plans ── */
    mealPlans: { type: [mealPlanSchema], default: [] },

    /* ── Policies ── */
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    cancellationPolicy: { type: String, default: "" },
    petFriendly: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },

    /* ── Contact ── */
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true },
);

/* ── Auto-compute pricePerNight & totalRooms before save ── */
hotelSchema.pre("save", function (next) {
  if (this.roomCategories && this.roomCategories.length > 0) {
    this.pricePerNight = Math.min(
      ...this.roomCategories.map((r) => r.pricePerNight),
    );
    this.totalRooms = this.roomCategories.reduce(
      (sum, r) => sum + (r.totalRooms || 0),
      0,
    );
  }
  next();
});

/* ─────────────────────────────────────────────
   HotelBooking schema
───────────────────────────────────────────── */
const hotelBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    /* ── Stay dates ── */
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },

    /* ── Guests ── */
    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, default: 0 },

    /* ── Room selection ── */
    roomCategoryId: { type: String, required: true }, // e.g. "suite"
    roomCategoryName: { type: String, default: "" }, // snapshot
    bedType: {
      type: String,
      enum: ["Single", "Double", "Queen", "King", "Twin"],
      required: true,
    },
    floorPreference: { type: String, default: "No preference" },

    /* ── Meal plan ── */
    mealPlanId: { type: String, default: "" }, // e.g. "all_inclusive"
    mealPlanName: { type: String, default: "" }, // snapshot

    /* ── Add-ons (hotel-wide extras) ── */
    addons: { type: [String], default: [] },

    /* ── Special requests ── */
    specialRequests: { type: [String], default: [] },

    /* ── Payment ── */
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "ewallet", "instapay"],
      required: true,
      default: "credit_card",
    },

    /* ── Pricing snapshot ── */
    roomPricePerNight: { type: Number, required: true },
    mealPlanTotal: { type: Number, default: 0 },
    addonsTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    depositPct: { type: Number, default: 25 },
    depositAmount: { type: Number, required: true },
    remainingAmount: { type: Number, default: 0 },
    screenshotUrl: { type: String, default: "" },

    /* ── Booking status ── */
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked_in", "checked_out"],
      default: "pending",
    },

    /* ── Admin / internal notes ── */
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

hotelBookingSchema.index({ hotel: 1, checkIn: 1, checkOut: 1, status: 1 });
hotelBookingSchema.index({ user: 1, status: 1 });

/* ─────────────────────────────────────────────
   Exports
───────────────────────────────────────────── */
const HotelBooking =
  mongoose.models.HotelBooking ||
  mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
