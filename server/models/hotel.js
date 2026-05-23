const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxOccupancy: { type: Number, default: 2 },
    bedOptions: { type: [String], default: ["Double"] },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    totalRooms: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false },
);

const mealPlanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    pricePerPersonPerNight: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false },
);

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, default: 3 },
    description: { type: String, default: "" },

    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAvailable: { type: Boolean, default: true },
    images: { type: [String], default: [] },

    roomCategories: { type: [roomCategorySchema], default: [] },
    pricePerNight: { type: Number, default: 0 },
    totalRooms: { type: Number, default: 0 },

    amenities: { type: [String], default: [] },
    mealPlans: { type: [mealPlanSchema], default: [] },

    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    cancellationPolicy: { type: String, default: "" },
    petFriendly: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true },
);

hotelSchema.index({ isAvailable: 1 });

module.exports = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
