const { Router } = require("express");
const { send } = require("../controllers/mailer.controller");

const router = Router()
router.route("/send").post(send)

module.exports = router;