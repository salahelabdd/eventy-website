const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  // category mirrors type; kept for frontend compatibility
  category: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  // Provider who owns this service (set on admin approval)
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
