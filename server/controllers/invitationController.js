const sendEmail = require("../utils/emailService");

// SEND INVITATIONS
const sendInvitations = async (req, res) => {
  try {
    const { emails, message } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({
        message: "No emails provided",
      });
    }

    for (let email of emails) {
      await sendEmail(
        email,
        "Event Invitation - Eventy",
        message || "You are invited to an event!",
      );
    }

    res.json({
      message: "Invitations sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendInvitations };
