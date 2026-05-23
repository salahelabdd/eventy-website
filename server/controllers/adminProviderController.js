const ProviderRequest = require("../models/ProviderRequest");
const Venue = require("../models/venue");
const Hotel = require("../models/hotel");
const Service = require("../models/service");

// GET ALL PROVIDER REQUESTS (ADMIN)
const getAllProviderRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const requests = await ProviderRequest.find(filter)
      .populate("provider", "fullName email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACCEPT PROVIDER REQUEST (ADMIN)
const acceptProviderRequest = async (req, res) => {
  try {
    const request = await ProviderRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request is already ${request.status}` });
    }

    const providerId = request.provider;

    if (request.type === "venue") {
      await Venue.create({
        provider: providerId,
        name: request.name,
        location: request.location,
        capacity: request.capacity,
        pricePerHour: request.pricePerHour,
        description: request.description,
        isAvailable: request.isAvailable ?? true,
        images: request.images ?? [],
        // legacy single field — first key of the pricing map
        eventType:
          request.eventType ||
          (request.eventTypePricing
            ? [...request.eventTypePricing.keys()][0]
            : "other"),
        // carry over the provider's pricing config exactly as submitted
        ...(request.eventTypePricing && request.eventTypePricing.size > 0
          ? { eventTypePricing: Object.fromEntries(request.eventTypePricing) }
          : {}),
        ...(Array.isArray(request.guestTierPricing) &&
        request.guestTierPricing.length > 0
          ? { guestTierPricing: request.guestTierPricing }
          : {}),
      });
    } else if (request.type === "hotel") {
      const roomCategories = request.roomCategories ?? [];
      const prices = roomCategories
        .map((r) => Number(r.pricePerNight))
        .filter((n) => !isNaN(n) && n >= 0);
      const pricePerNight = prices.length > 0 ? Math.min(...prices) : 0;
      const totalRooms = roomCategories.reduce(
        (sum, r) => sum + (Number(r.totalRooms) || 0),
        0,
      );

      await Hotel.create({
        provider: providerId,
        name: request.name,
        location: request.location,
        description: request.description,
        stars: request.stars,
        isAvailable: request.isAvailable ?? true,
        images: request.images ?? [],
        amenities: request.amenities ?? [],
        roomCategories,
        mealPlans: request.mealPlans ?? [],
        checkInTime: request.checkInTime || "14:00",
        checkOutTime: request.checkOutTime || "12:00",
        cancellationPolicy: request.cancellationPolicy || "",
        contactEmail: request.contactEmail || "",
        contactPhone: request.contactPhone || "",
        website: request.website || "",
        petFriendly: request.petFriendly ?? false,
        smokingAllowed: request.smokingAllowed ?? false,
        pricePerNight,
        totalRooms,
      });
    } else if (request.type === "service") {
      // Service model requires a "type" field that represents the service category
      // (e.g. "catering", "photography") — map from request.category, fall back to name
      const serviceType = request.category || request.name;

      if (!serviceType) {
        return res.status(400).json({
          message:
            "Service request is missing a category — cannot create listing.",
        });
      }

      await Service.create({
        provider: providerId, // ← link to the provider who submitted
        name: request.name,
        type: serviceType,
        category: request.category || "",
        price: request.price,
        description: request.description || "",
        image: "",
      });
    } else {
      return res
        .status(400)
        .json({ message: `Unknown request type: ${request.type}` });
    }

    request.status = "accepted";
    request.adminNote = req.body?.adminNote || "";
    await request.save({ validateModifiedOnly: true });

    res.json({
      message: "Request accepted and listing created successfully",
      request,
    });
  } catch (error) {
    console.error("[acceptProviderRequest] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// REJECT PROVIDER REQUEST (ADMIN)
const rejectProviderRequest = async (req, res) => {
  try {
    const request = await ProviderRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request is already ${request.status}` });
    }

    request.status = "rejected";
    request.adminNote = req.body?.adminNote || "";
    request.rejectionReason = req.body?.reason?.trim() || null; // ← add this
    await request.save({ validateModifiedOnly: true });

    res.json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("[rejectProviderRequest] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProviderRequests,
  acceptProviderRequest,
  rejectProviderRequest,
};
