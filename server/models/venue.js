const mongoose = require("mongoose");

/* ─────────────────────────────────────────────
   Defaults — used when a venue is first created.
   The provider can override any value via the
   admin panel at any time.
───────────────────────────────────────────── */
const DEFAULT_EVENT_TYPE_PRICING = {
  wedding: 1.5,
  gala: 1.4,
  anniversary: 1.3,
  engagement: 1.3,
  prom: 1.2,
  concert: 1.2,
  corporate: 1.2,
  conference: 1.15,
  exhibition: 1.15,
  business: 1.1,
  graduation: 1.1,
  birthday: 1.0,
  baby_shower: 1.0,
  bridal_shower: 1.1,
  fashion_show: 1.2,
  festival: 1.2,
  charity: 1.0,
  networking: 1.0,
  seminar: 1.0,
  workshop: 1.0,
  product_launch: 1.2,
  award_ceremony: 1.3,
  photoshoot: 1.0,
  private_party: 1.1,
  retirement: 1.0,
  reunion: 1.0,
  sports_event: 1.1,
  cultural_event: 1.1,
  religious_event: 1.0,
  holiday_party: 1.1,
  music_festival: 1.3,
  gaming_event: 1.0,
  vip_event: 1.5,
  cocktail_party: 1.1,
  dinner_party: 1.1,
  other: 1.0,
};

/**
 * Guest tier pricing stored as an array of bracket objects so the provider
 * can define as many brackets as they want.
 *
 * Each bracket: { min, max, multiplier, label }
 *   min / max  — inclusive guest-count bounds (use 999999 for "no upper limit")
 *   multiplier — price factor applied to the adjusted venue cost
 *   label      — shown in the UI, e.g. "1–50 guests"
 */
const DEFAULT_GUEST_TIER_PRICING = [
  { min: 1, max: 50, multiplier: 1.0, label: "1–50 guests" },
  { min: 51, max: 200, multiplier: 1.15, label: "51–200 guests" },
  { min: 201, max: 500, multiplier: 1.3, label: "201–500 guests" },
  { min: 501, max: 999999, multiplier: 1.5, label: "501+ guests" },
];

const guestTierSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    multiplier: { type: Number, required: true, default: 1.0 },
    label: { type: String, required: true },
  },
  { _id: false }, // no extra _id per tier
);

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    images: {
      type: [String],
      default: [],
    },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },

    eventType: {
      type: String,
      required: true,
      enum: [
        "wedding",
        "conference",
        "birthday",
        "concert",
        "corporate",
        "exhibition",
        "gala",
        "prom",
        "engagement",
        "anniversary",
        "graduation",
        "business",
        "baby_shower",
        "bridal_shower",
        "fashion_show",
        "festival",
        "charity",
        "networking",
        "seminar",
        "workshop",
        "product_launch",
        "award_ceremony",
        "photoshoot",
        "private_party",
        "retirement",
        "reunion",
        "sports_event",
        "cultural_event",
        "religious_event",
        "holiday_party",
        "music_festival",
        "gaming_event",
        "vip_event",
        "cocktail_party",
        "dinner_party",
        "other",
      ],
    },

    /**
     * eventTypePricing — provider-defined multiplier per event type.
     * e.g. { wedding: 1.5, corporate: 1.2 }
     * Falls back to 1.0 for any missing key.
     */
    eventTypePricing: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },

    /**
     * guestTierPricing — provider-defined guest-count brackets.
     * Stored as an array so the provider can add/remove brackets freely.
     * Sorted ascending by `min` at read time.
     */
    guestTierPricing: {
      type: [guestTierSchema],
      default: () => DEFAULT_GUEST_TIER_PRICING.map((t) => ({ ...t })),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Venue || mongoose.model("Venue", venueSchema);
module.exports.DEFAULT_EVENT_TYPE_PRICING = DEFAULT_EVENT_TYPE_PRICING;
module.exports.DEFAULT_GUEST_TIER_PRICING = DEFAULT_GUEST_TIER_PRICING;
