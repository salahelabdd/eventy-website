const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    eventType: { type: String, required: true },
    guestCount: { type: Number, required: true },
    eventDate: { type: Date, required: true },
    hours: { type: Number, required: true },

    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    invites: [{ type: String }],

    // ── Pricing snapshot (computed server-side, stored for receipts) ──────────
    baseCost: { type: Number, default: 0 }, // hours × (pricePerHour × 10)
    eventMultiplier: { type: Number, default: 1 }, // from venue.eventTypePricing
    guestMultiplier: { type: Number, default: 1 }, // from guest-count tier
    guestTierLabel: { type: String, default: "" }, // e.g. "51–200 guests"
    adjustedVenueCost: { type: Number, default: 0 }, // baseCost × both multipliers
    servicesTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // adjustedVenueCost + servicesTotal

    // ── Deposit ───────────────────────────────────────────────────────────────
    depositPct: { type: Number, default: 25 },
    depositAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["ewallet", "instapay"],
      default: "instapay",
    },

    screenshotUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Fast availability lookups
bookingSchema.index({ venue: 1, eventDate: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
