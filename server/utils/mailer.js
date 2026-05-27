const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const sendVerificationEmail = async (toEmail, code, type = "verify") => {
  const isReset = type === "reset";
  const subject = isReset
    ? "Your Eventy Password Reset Code"
    : "Your Eventy Verification Code";
  const heading = isReset ? "PASSWORD RESET" : "EMAIL VERIFICATION";
  const message = isReset
    ? 'We received a request to reset your password. Use the code below. It expires in <strong style="color:#E2C97E !important">10 minutes</strong>.'
    : 'Thank you for registering. Use the code below to verify your email. It expires in <strong style="color:#E2C97E !important">10 minutes</strong>.';

  await transporter.sendMail({
    from: `"Eventy" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body, table, td, div, p, span { -webkit-text-size-adjust: 100%; }
  </style>
</head>
<body bgcolor="#0A0A0A" style="margin:0 !important; padding:0 !important; background-color:#0A0A0A !important; font-family:Georgia,serif; color:#F0EAD6 !important;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0A0A0A" style="background-color:#0A0A0A !important;">
    <tr>
      <td align="center" bgcolor="#0A0A0A" style="padding:40px 20px !important; background-color:#0A0A0A !important;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
          <tr>
            <td bgcolor="#0A0A0A" style="background-color:#0A0A0A !important;">

              <!-- Gold top line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#C8A951" height="2" style="height:2px !important; font-size:0; line-height:0; background-color:#C8A951 !important;">&nbsp;</td>
                </tr>
              </table>

              <!-- Main content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#111118" style="background-color:#111118 !important; padding:48px 40px !important;">

                    <!-- Logo -->
                    <p style="font-size:22px; font-weight:400; color:#C8A951 !important; letter-spacing:0.2em; margin:0 0 8px 0; font-family:Georgia,serif;">EVENTY</p>
                    <p style="font-size:13px; color:rgba(240,234,214,0.5) !important; letter-spacing:0.15em; margin:0 0 40px 0; font-family:Georgia,serif;">${heading}</p>

                    <!-- Message -->
                    <p style="font-size:15px; font-weight:300; line-height:1.8; margin:0 0 32px 0; color:#F0EAD6 !important; font-family:Georgia,serif;">${message}</p>

                    <!-- Code box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                      <tr>
                        <td bgcolor="#0A0A0A" align="center" style="background-color:#0A0A0A !important; border:1px solid #C8A951; padding:32px !important; text-align:center !important;">
                          <p style="font-size:11px; letter-spacing:0.3em; color:rgba(240,234,214,0.45) !important; margin:0 0 16px 0; font-family:Georgia,serif;">YOUR CODE</p>
                          <p style="font-size:42px; font-weight:600; letter-spacing:0.35em; color:#C8A951 !important; margin:0; font-family:Georgia,serif;">${code}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer note -->
                    <p style="font-size:12px; color:rgba(240,234,214,0.35) !important; line-height:1.7; margin:0; font-family:Georgia,serif;">
                      If you did not request this, you can safely ignore this email.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Gold bottom line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#C8A951" height="2" style="height:2px !important; font-size:0; line-height:0; background-color:#C8A951 !important;">&nbsp;</td>
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
    `,
    timeout: 10000,
  });

  console.log("Email sent to", toEmail);
};

module.exports = { sendVerificationEmail };
