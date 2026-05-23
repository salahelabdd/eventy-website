const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/providerController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const provider = [protect, authorizeRoles("provider", "admin")];
// ─── Submit requests ───────────────────────────────────────────────────────
router.post("/venues/request", ...provider, submitVenueRequest);
router.post("/hotels/request", ...provider, submitHotelRequest);
router.post("/services/request", ...provider, submitServiceRequest);

// ─── Get my requests (ProviderRequest collection) ──────────────────────────
router.get("/venues/requests", ...provider, getMyVenueRequests);
router.get("/hotels/requests", ...provider, getMyHotelRequests);
router.get("/services/requests", ...provider, getMyServiceRequests);
router.get("/requests", ...provider, getAllMyRequests);

// ─── Get my accepted listings (real Venue/Hotel/Service collections) ────────
router.get("/venues", ...provider, getMyVenues);
router.get("/hotels", ...provider, getMyHotels);
router.get("/services", ...provider, getMyServices);

// ─── Edit accepted listings ────────────────────────────────────────────────
router.put("/venues/:id", ...provider, updateMyVenue);
router.put("/hotels/:id", ...provider, updateMyHotel);
router.put("/services/:id", ...provider, updateMyService);

// ─── Delete accepted listings ──────────────────────────────────────────────
router.delete("/venues/:id", ...provider, deleteMyVenue);
router.delete("/hotels/:id", ...provider, deleteMyHotel);
router.delete("/services/:id", ...provider, deleteMyService);

module.exports = router;
