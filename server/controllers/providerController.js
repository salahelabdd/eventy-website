const ProviderRequest = require("../models/ProviderRequest");
const Venue = require("../models/venue");
const Hotel = require("../models/hotel");
const Service = require("../models/service");

// ─── SUBMIT REQUESTS ───────────────────────────────────────────────────────

const submitVenueRequest = async (req, res) => {
  try {
    const {
      name,
      location,
      capacity,
      pricePerHour,
      description,
      isAvailable,
      // new fields
      images,
      eventType, // legacy single value (first selected type)
      eventTypePricing, // { wedding: 1.5, corporate: 1.2, … }
      guestTierPricing, // [{ min, max, multiplier, label }, …]
    } = req.body;

    // At least one event type must be selected
    const hasEventTypes =
      (eventTypePricing && Object.keys(eventTypePricing).length > 0) ||
      !!eventType;

    if (
      !name ||
      !location ||
      !capacity ||
      !pricePerHour ||
      !description ||
      !hasEventTypes
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const request = await ProviderRequest.create({
      provider: req.user._id,
      type: "venue",
      name,
      location,
      capacity,
      pricePerHour,
      description,
      isAvailable: isAvailable ?? true,
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      // legacy single field — first key of the pricing map
      eventType:
        eventType ||
        (eventTypePricing ? Object.keys(eventTypePricing)[0] : "other"),
      eventTypePricing: eventTypePricing || undefined,
      guestTierPricing:
        Array.isArray(guestTierPricing) && guestTierPricing.length
          ? guestTierPricing
          : undefined,
    });

    res.status(201).json({
      message: "Venue request submitted successfully. Awaiting admin approval.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitHotelRequest = async (req, res) => {
  try {
    const {
      name,
      location,
      stars,
      description,
      isAvailable,
      images,
      amenities,
      roomCategories,
      mealPlans,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      contactEmail,
      contactPhone,
      website,
      petFriendly,
      smokingAllowed,
    } = req.body;

    if (!name || !location || !stars || !description)
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });

    if (!roomCategories || roomCategories.length === 0)
      return res
        .status(400)
        .json({ message: "At least one room category is required" });

    if (roomCategories.some((r) => !r.name || !r.pricePerNight))
      return res
        .status(400)
        .json({ message: "Each room category must have a name and price" });

    const request = await ProviderRequest.create({
      provider: req.user._id,
      type: "hotel",
      name,
      location,
      stars,
      description,
      isAvailable: isAvailable ?? true,
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      amenities: amenities || [],
      roomCategories: roomCategories || [],
      mealPlans: mealPlans || [],
      checkInTime: checkInTime || "14:00",
      checkOutTime: checkOutTime || "12:00",
      cancellationPolicy: cancellationPolicy || "",
      contactEmail: contactEmail || "",
      contactPhone: contactPhone || "",
      website: website || "",
      petFriendly: petFriendly ?? false,
      smokingAllowed: smokingAllowed ?? false,
      // auto-compute for display
      pricePerNight: roomCategories?.length
        ? Math.min(...roomCategories.map((r) => Number(r.pricePerNight) || 0))
        : 0,
      totalRooms:
        roomCategories?.reduce(
          (sum, r) => sum + (Number(r.totalRooms) || 0),
          0,
        ) || 0,
    });

    res.status(201).json({
      message: "Hotel request submitted successfully. Awaiting admin approval.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitServiceRequest = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      priceUnit,
      description,
      location,
      contactEmail,
    } = req.body;

    if (!name || !category || !price || !description || !contactEmail)
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });

    const request = await ProviderRequest.create({
      provider: req.user._id,
      type: "service",
      name,
      category,
      price,
      priceUnit: priceUnit || "flat",
      description,
      location,
      contactEmail,
    });

    res.status(201).json({
      message:
        "Service request submitted successfully. Awaiting admin approval.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY REQUESTS ───────────────────────────────────────────────────────

const getMyVenueRequests = async (req, res) => {
  try {
    const requests = await ProviderRequest.find({
      provider: req.user._id,
      type: "venue",
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyHotelRequests = async (req, res) => {
  try {
    const requests = await ProviderRequest.find({
      provider: req.user._id,
      type: "hotel",
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ProviderRequest.find({
      provider: req.user._id,
      type: "service",
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMyRequests = async (req, res) => {
  try {
    const requests = await ProviderRequest.find({
      provider: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY ACCEPTED LISTINGS ──────────────────────────────────────────────

const getMyVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ provider: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ provider: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyServices = async (req, res) => {
  try {
    const byProvider = await Service.find({ provider: req.user._id }).sort({
      createdAt: -1,
    });

    if (byProvider.length === 0) {
      const acceptedRequests = await ProviderRequest.find({
        provider: req.user._id,
        type: "service",
        status: "accepted",
      }).select("name");

      if (acceptedRequests.length > 0) {
        const names = acceptedRequests.map((r) => r.name);
        const byName = await Service.find({
          name: { $in: names },
          provider: null,
        }).sort({ createdAt: -1 });

        if (byName.length > 0) {
          await Service.updateMany(
            { _id: { $in: byName.map((s) => s._id) } },
            { $set: { provider: req.user._id } },
          );
          byName.forEach((s) => (s.provider = req.user._id));
        }

        return res.json(byName);
      }
    }

    res.json(byProvider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EDIT ACCEPTED LISTINGS ────────────────────────────────────────────────

const updateMyVenue = async (req, res) => {
  try {
    const venue = await Venue.findOne({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!venue)
      return res.status(404).json({ message: "Venue not found or not yours" });

    const allowed = [
      "name",
      "location",
      "capacity",
      "pricePerHour",
      "description",
      "isAvailable",
      "images",
      // legacy single type
      "eventType",
      // new pricing fields
      "eventTypePricing",
      "guestTierPricing",
    ];

    allowed.forEach((k) => {
      if (req.body[k] !== undefined) venue[k] = req.body[k];
    });

    // Keep legacy eventType in sync with the pricing map
    if (
      req.body.eventTypePricing &&
      typeof req.body.eventTypePricing === "object"
    ) {
      const keys = Object.keys(req.body.eventTypePricing);
      if (keys.length > 0) venue.eventType = keys[0];
    }

    await venue.save({ validateModifiedOnly: true });
    res.json({ message: "Venue updated successfully", venue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!hotel)
      return res.status(404).json({ message: "Hotel not found or not yours" });

    const allowed = [
      "name",
      "location",
      "stars",
      "description",
      "isAvailable",
      "images",
      "amenities",
      "roomCategories",
      "mealPlans",
      "checkInTime",
      "checkOutTime",
      "cancellationPolicy",
      "contactEmail",
      "contactPhone",
      "website",
      "petFriendly",
      "smokingAllowed",
    ];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) hotel[k] = req.body[k];
    });

    await hotel.save({ validateModifiedOnly: true });
    res.json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateMyService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!service)
      return res
        .status(404)
        .json({ message: "Service not found or not yours" });

    const allowed = [
      "name",
      "type",
      "category",
      "price",
      "description",
      "image",
    ];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) service[k] = req.body[k];
    });

    await service.save({ validateModifiedOnly: true });
    res.json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE ACCEPTED LISTINGS ──────────────────────────────────────────────

const deleteMyVenue = async (req, res) => {
  try {
    const venue = await Venue.findOneAndDelete({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!venue)
      return res.status(404).json({ message: "Venue not found or not yours" });
    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMyHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!hotel)
      return res.status(404).json({ message: "Hotel not found or not yours" });
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMyService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      provider: req.user._id,
    });
    if (!service)
      return res
        .status(404)
        .json({ message: "Service not found or not yours" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitVenueRequest,
  submitHotelRequest,
  submitServiceRequest,
  getMyVenueRequests,
  getMyHotelRequests,
  getMyServiceRequests,
  getAllMyRequests,
  getMyVenues,
  getMyHotels,
  getMyServices,
  updateMyVenue,
  updateMyHotel,
  updateMyService,
  deleteMyVenue,
  deleteMyHotel,
  deleteMyService,
};
