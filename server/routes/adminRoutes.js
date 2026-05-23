const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/adminController");

const {
  getAllProviderRequests,
  acceptProviderRequest,
  rejectProviderRequest,
} = require("../controllers/adminProviderController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ── Users ──
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id", protect, authorizeRoles("admin"), updateUser);
router.post("/users", protect, authorizeRoles("admin"), createUser);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

// ── Provider Requests ──
router.get(
  "/provider-requests",
  protect,
  authorizeRoles("admin"),
  getAllProviderRequests,
);
router.patch(
  "/provider-requests/:id/accept",
  protect,
  authorizeRoles("admin"),
  acceptProviderRequest,
);
router.patch(
  "/provider-requests/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectProviderRequest,
);
router.get(
  "/hotel-reservations",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ reservations: [] });
  },
);

module.exports = router;
