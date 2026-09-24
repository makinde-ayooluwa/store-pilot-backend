const { Router } = require("express");
const { sendMail } = require("../controllers/mailer.controller");

const router = Router()
// router.route("/sendMail").post(sendMail)

module.exports = router;