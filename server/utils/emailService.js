const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  // ── Owner details block ───────────────────────────────────────────
  const ownerDetailsBlock = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
      <tr>
        <td class="row-td" bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; background:#0A0A0A;">
          <span style="font-size:10px; font-weight:200; color:rgba(240,234,214,0.5);">Expected Guests</span>
        </td>
        <td class="row-td" bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; background:#0A0A0A; text-align:right;">
          <span style="font-family:'Cormorant Garamond',Georgia,serif; font-size:15px; color:#F0EAD6;">${guestCount?.toLocaleString()}</span>
        </td>
      </tr>
      <tr>
        <td class="row-td" bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; background:#0A0A0A;">
          <span style="font-size:10px; font-weight:200; color:rgba(240,234,214,0.5);">Deposit Paid (${depositPct}%)</span>
        </td>
        <td class="row-td" bgcolor="#0A0A0A" style="padding:12px 20px; border:1px solid rgba(200,169,81,0.08); border-bottom:none; background:#0A0A0A; text-align:right;">
          <span style="font-family:'Cormorant Garamond',Georgia,serif; font-size:15px; color:#E2C97E;">$${depositAmount?.toLocaleString()}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="confirm-td" bgcolor="#1a1508" style="padding:16px 20px; border:1px solid rgba(200,169,81,0.22); background:#1a1508; text-align:center;">
          <span style="font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#C8A951;">
            ✦ Reservation Confirmed
          </span>
        </td>
      </tr>
    </table>
  `;

  // ── Guest details block ───────────────────────────────────────────
  const guestDetailsBlock = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
      <tr>
        <td colspan="2" class="confirm-td" bgcolor="#1a1508" style="padding:16px 20px; border:1px solid rgba(200,169,81,0.22); background:#1a1508; text-align:center;">
          <span style="font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#C8A951;">
            ✦ Your Presence is Requested
          </span>
        </td>
      </tr>
    </table>
  `;

  // ── Hero greeting ─────────────────────────────────────────────────
  const heroGreeting = isOwner
    ? `Dear <strong style="color:#F0EAD6;">${guestName}</strong>, your reservation has been confirmed.`
    : `<strong style="color:#C8A951;">${inviterName ?? "Someone"}</strong> has invited you to their <strong style="color:#F0EAD6;">${eventType}</strong>.`;

  // ── Subject line ──────────────────────────────────────────────────
  const subject = isOwner
    ? `✦ Reservation Confirmed — ${eventType} at ${venue?.name ?? "Eventy"}`
    : `✦ You're Invited — ${inviterName ?? "Someone"} invites you to their ${eventType}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td { background-color: #0A0A0A; }
    @media (prefers-color-scheme: dark) {
      body, table, td { background-color: #0A0A0A !important; color: #F0EAD6 !important; }
      .card-td { background-color: #111118 !important; }
      .venue-td { background-color: #0A0A0A !important; }
      .row-td { background-color: #0A0A0A !important; }
      .confirm-td { background-color: #1a1508 !important; }
      .outer-td { background-color: #0A0A0A !important; }
    }
  </style>
</head>
<body bgcolor="#0A0A0A" style="background:#0A0A0A; margin:0; padding:0; font-family:'Raleway',Georgia,serif; color:#F0EAD6;">

  <!-- Outer wrapper: fixes Gmail which ignores body bgcolor -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0A0A0A" style="background:#0A0A0A;">
    <tr>
      <td class="outer-td" bgcolor="#0A0A0A" align="center" style="padding: 40px 20px; background:#0A0A0A;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td bgcolor="#111118" style="background:#111118; border:1px solid rgba(200,169,81,0.35); padding:0;">

              <!-- Gold top line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#C8A951" height="2" style="height:2px; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Logo -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-td" bgcolor="#111118" align="center" style="padding: 36px 44px 28px; border-bottom: 1px solid rgba(200,169,81,0.22); background:#111118;">
                    <div style="display:inline-block; width:28px; height:28px; border:1.5px solid #C8A951; transform:rotate(45deg); margin-bottom:16px;"></div>
                    <div style="font-family:'Cinzel',serif; font-size:22px; font-weight:600; letter-spacing:0.28em; color:#F0EAD6; text-transform:uppercase;">
                      Event<span style="color:#C8A951;">y</span>
                    </div>
                    <div style="font-size:9px; font-weight:300; letter-spacing:0.45em; text-transform:uppercase; color:#C8A951; opacity:0.8; margin-top:8px;">
                      ◆ ${isOwner ? "Booking Confirmation" : "Official Invitation"}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Hero -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-td" bgcolor="#111118" align="center" style="padding: 44px 44px 36px; border-bottom:1px solid rgba(200,169,81,0.22); background:#111118;">
                    <div style="font-size:9px; font-weight:300; letter-spacing:0.45em; text-transform:uppercase; color:#C8A951; margin-bottom:16px;">
                      ${isOwner ? "Your reservation is confirmed" : "You are cordially invited"}
                    </div>
                    <div style="font-family:'Cormorant Garamond',Georgia,serif; font-size:42px; font-weight:300; color:#F0EAD6; line-height:1.1; margin-bottom:12px;">
                      ${eventType}
                    </div>
                    <div style="width:60px; height:1px; background:#C8A951; margin:0 auto 20px; opacity:0.6;"></div>
                    <div style="font-size:13px; font-weight:200; color:rgba(240,234,214,0.7); letter-spacing:0.06em; line-height:1.7;">
                      ${heroGreeting}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Venue & Date -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-td" bgcolor="#111118" style="padding: 36px 44px; background:#111118;">

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 12px 0 0; width:50%; vertical-align:top;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td class="venue-td" bgcolor="#0A0A0A" style="border:1px solid rgba(200,169,81,0.22); padding:20px; background:#0A0A0A;">
                                <div style="font-size:8px; font-weight:300; letter-spacing:0.38em; text-transform:uppercase; color:#C8A951; opacity:0.7; margin-bottom:10px;">Venue</div>
                                <div style="font-family:'Cormorant Garamond',Georgia,serif; font-size:18px; font-weight:300; color:#F0EAD6; margin-bottom:4px;">${venue?.name ?? "—"}</div>
                                <div style="font-size:11px; font-weight:200; color:rgba(240,234,214,0.5);">${venue?.location ?? "—"}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding:0 0 0 12px; width:50%; vertical-align:top;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td class="venue-td" bgcolor="#0A0A0A" style="border:1px solid rgba(200,169,81,0.22); padding:20px; background:#0A0A0A;">
                                <div style="font-size:8px; font-weight:300; letter-spacing:0.38em; text-transform:uppercase; color:#C8A951; opacity:0.7; margin-bottom:10px;">Date &amp; Time</div>
                                <div style="font-family:'Cormorant Garamond',Georgia,serif; font-size:18px; font-weight:300; color:#F0EAD6; margin-bottom:4px;">${formattedDate}</div>
                                <div style="font-size:11px; font-weight:200; color:rgba(240,234,214,0.5);">Duration: ${hours} hour${hours !== 1 ? "s" : ""}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${isOwner ? ownerDetailsBlock : guestDetailsBlock}
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-td" bgcolor="#111118" align="center" style="padding:24px 44px; border-top:1px solid rgba(200,169,81,0.22); background:#111118;">
                    <div style="font-size:10px; font-weight:200; color:rgba(240,234,214,0.4); letter-spacing:0.08em;">
                      © 2026 <span style="color:#C8A951;">Eventy</span> — Luxury Event Planning Platform
                    </div>
                    <div style="font-size:10px; font-weight:200; color:rgba(240,234,214,0.25); margin-top:6px; letter-spacing:0.04em;">
                      This is an automated message. Please do not reply to this email.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Gold bottom line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#C8A951" height="2" style="height:2px; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
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

  await transporter.sendMail({
    from: `"Eventy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendInvitationEmail };
