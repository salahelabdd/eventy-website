const axios = require("axios");

const sendInvitationEmail = async ({
  to,
  guestName,
  booking,
  isOwner,
  inviterName,
}) => {
  const {
    venue,
    eventType,
    eventDate,
    hours,
    guestCount,
    depositAmount,
    depositPct,
  } = booking;

  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ownerDetailsBlock = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
      <tr>
        <td bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none;">
          <span style="font-size:10px; color:rgba(240,234,214,0.5);">Expected Guests</span>
        </td>
        <td bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; text-align:right;">
          <span style="font-size:15px; color:#F0EAD6;">${guestCount?.toLocaleString()}</span>
        </td>
      </tr>
      <tr>
        <td bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none;">
          <span style="font-size:10px; color:rgba(240,234,214,0.5);">Deposit Paid (${depositPct}%)</span>
        </td>
        <td bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; text-align:right;">
          <span style="font-size:15px; color:#E2C97E;">$${depositAmount?.toLocaleString()}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" bgcolor="#1a1508" style="padding:16px 20px; border:1px solid rgba(200,169,81,0.22); text-align:center;">
          <span style="font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#C8A951;">✦ Reservation Confirmed</span>
        </td>
      </tr>
    </table>
  `;

  const guestDetailsBlock = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
      <tr>
        <td colspan="2" bgcolor="#1a1508" style="padding:16px 20px; border:1px solid rgba(200,169,81,0.22); text-align:center;">
          <span style="font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#C8A951;">✦ Your Presence is Requested</span>
        </td>
      </tr>
    </table>
  `;

  const heroGreeting = isOwner
    ? `Dear <strong style="color:#F0EAD6;">${guestName}</strong>, your reservation has been confirmed.`
    : `<strong style="color:#C8A951;">${inviterName ?? "Someone"}</strong> has invited you to their <strong style="color:#F0EAD6;">${eventType}</strong>.`;

  const subject = isOwner
    ? `✦ Reservation Confirmed — ${eventType} at ${venue?.name ?? "Eventy"}`
    : `✦ You're Invited — ${inviterName ?? "Someone"} invites you to their ${eventType}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body bgcolor="#0A0A0A" style="background:#0A0A0A;margin:0;padding:0;font-family:Georgia,serif;color:#F0EAD6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0A0A0A">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td bgcolor="#111118" style="border:1px solid rgba(200,169,81,0.35);padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td bgcolor="#C8A951" height="2" style="height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#111118" align="center" style="padding:36px 44px 28px;border-bottom:1px solid rgba(200,169,81,0.22);">
                    <div style="font-size:22px;letter-spacing:0.28em;color:#F0EAD6;text-transform:uppercase;">Event<span style="color:#C8A951;">y</span></div>
                    <div style="font-size:9px;letter-spacing:0.45em;text-transform:uppercase;color:#C8A951;margin-top:8px;">◆ ${isOwner ? "Booking Confirmation" : "Official Invitation"}</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#111118" align="center" style="padding:44px 44px 36px;border-bottom:1px solid rgba(200,169,81,0.22);">
                    <div style="font-size:9px;letter-spacing:0.45em;text-transform:uppercase;color:#C8A951;margin-bottom:16px;">${isOwner ? "Your reservation is confirmed" : "You are cordially invited"}</div>
                    <div style="font-size:42px;font-weight:300;color:#F0EAD6;line-height:1.1;margin-bottom:12px;">${eventType}</div>
                    <div style="width:60px;height:1px;background:#C8A951;margin:0 auto 20px;opacity:0.6;"></div>
                    <div style="font-size:13px;color:rgba(240,234,214,0.7);line-height:1.7;">${heroGreeting}</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#111118" style="padding:36px 44px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 12px 0 0;width:50%;vertical-align:top;">
                          <td bgcolor="#0A0A0A" style="border:1px solid rgba(200,169,81,0.22);padding:20px;">
                            <div style="font-size:8px;letter-spacing:0.38em;text-transform:uppercase;color:#C8A951;margin-bottom:10px;">Venue</div>
                            <div style="font-size:18px;color:#F0EAD6;margin-bottom:4px;">${venue?.name ?? "—"}</div>
                            <div style="font-size:11px;color:rgba(240,234,214,0.5);">${venue?.location ?? "—"}</div>
                          </td>
                        </td>
                        <td style="padding:0 0 0 12px;width:50%;vertical-align:top;">
                          <td bgcolor="#0A0A0A" style="border:1px solid rgba(200,169,81,0.22);padding:20px;">
                            <div style="font-size:8px;letter-spacing:0.38em;text-transform:uppercase;color:#C8A951;margin-bottom:10px;">Date &amp; Time</div>
                            <div style="font-size:18px;color:#F0EAD6;margin-bottom:4px;">${formattedDate}</div>
                            <div style="font-size:11px;color:rgba(240,234,214,0.5);">Duration: ${hours} hour${hours !== 1 ? "s" : ""}</div>
                          </td>
                        </td>
                      </tr>
                    </table>
                    ${isOwner ? ownerDetailsBlock : guestDetailsBlock}
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#111118" align="center" style="padding:24px 44px;border-top:1px solid rgba(200,169,81,0.22);">
                    <div style="font-size:10px;color:rgba(240,234,214,0.4);">© 2026 <span style="color:#C8A951;">Eventy</span> — Luxury Event Planning Platform</div>
                    <div style="font-size:10px;color:rgba(240,234,214,0.25);margin-top:6px;">This is an automated message. Please do not reply.</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td bgcolor="#C8A951" height="2" style="height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: process.env.EMAIL_USER, name: "Eventy" },
      to: [{ email: to }],
      subject,
      htmlContent,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  console.log("Invitation email sent to", to);
};

module.exports = { sendInvitationEmail };
