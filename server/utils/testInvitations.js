require("dotenv").config({ path: "../.env" });
const { sendInvitationEmail } = require("./emailService");

sendInvitationEmail({
  to: "salahelabd000@gmail.com",
  guestName: "Amira Hassan",
  isOwner: true,
  inviterName: "mohammed",
  booking: {
    venue: { name: "The Grand Ballroom", location: "Cairo, Egypt" },
    eventType: "Wedding Reception",
    eventDate: new Date("2026-06-14"),
    hours: 5,
    guestCount: 150,
    depositAmount: 2500,
    depositPct: 25,
  },
})
  .then(() => console.log("Done!"))
  .catch(console.error);
