const axios = require("axios");

const sendVerificationEmail = async (toEmail, code, type = "verify") => {
  const isReset = type === "reset";
  const subject = isReset
    ? "Your Eventy Password Reset Code"
    : "Your Eventy Verification Code";
  const heading = isReset ? "PASSWORD RESET" : "EMAIL VERIFICATION";
  const message = isReset
    ? 'We received a request to reset your password. Use the code below. It expires in <strong style="color:#E2C97E !important">10 minutes</strong>.'
    : 'Thank you for registering. Use the code below to verify your email. It expires in <strong style="color:#E2C97E !important">10 minutes</strong>.';

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: process.env.EMAIL_USER, name: "Eventy" },
      to: [{ email: toEmail }],
      subject,
      htmlContent: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body bgcolor="#0A0A0A" style="margin:0;padding:0;background-color:#0A0A0A;font-family:Georgia,serif;color:#F0EAD6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
          <tr><td bgcolor="#C8A951" height="2" style="height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td bgcolor="#111118" style="padding:48px 40px;">
              <p style="font-size:22px;color:#C8A951;letter-spacing:0.2em;margin:0 0 8px 0;">EVENTY</p>
              <p style="font-size:13px;color:rgba(240,234,214,0.5);letter-spacing:0.15em;margin:0 0 40px 0;">${heading}</p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 32px 0;color:#F0EAD6;">${message}</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td bgcolor="#0A0A0A" align="center" style="border:1px solid #C8A951;padding:32px;text-align:center;">
                    <p style="font-size:11px;letter-spacing:0.3em;color:rgba(240,234,214,0.45);margin:0 0 16px 0;">YOUR CODE</p>
                    <p style="font-size:42px;font-weight:600;letter-spacing:0.35em;color:#C8A951;margin:0;">${code}</p>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:rgba(240,234,214,0.35);line-height:1.7;margin:0;">
                If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr><td bgcolor="#C8A951" height="2" style="height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  console.log("Email sent to", toEmail);
};

module.exports = { sendVerificationEmail };
