const express = require("express");
const router = express.Router();

const {
  getServices,
  createService,
  deleteService,
  updateService,
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getServices);
router.post("/", protect, authorizeRoles("admin"), createService);
router.put("/:id", protect, authorizeRoles("admin"), updateService);
router.delete("/:id", protect, authorizeRoles("admin"), deleteService);

module.exports = router;
