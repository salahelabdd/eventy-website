require("dotenv").config({ path: "../.env" });
const { sendVerificationEmail } = require("./mailer");

sendVerificationEmail("salahelabd000@gmail.com", "482910", "verify")
  .then(() => console.log("Done!"))
  .catch(console.error);