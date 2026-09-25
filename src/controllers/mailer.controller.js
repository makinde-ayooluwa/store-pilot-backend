const mailer = require("../middleware/mailer");
const Mail = require("../models/mail.model");

const send = async (req, res) => {
  const {subject, to, message} = req.body;
  // 1. Await nodemailer dispatch so errors bubble up to controller
  const info = await mailer.sendMail({
    to: to,
    html: message,
    subject: subject,
  });

  // 2. Save log record to MongoDB
  await Mail.create({ to, message, subject });

  // 3. Return confirmation object to the calling controller
  return res.status(200).json({ success: true, info });
};

module.exports = { send };