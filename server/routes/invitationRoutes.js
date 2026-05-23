const express = require("express");
const router = express.Router();

const { sendInvitations } = require("../controllers/invitationController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendInvitations);

module.exports = router;
