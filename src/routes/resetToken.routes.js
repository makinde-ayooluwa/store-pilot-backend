const { Router } = require("express");
const { validateToken } = require("../controllers/resetToken.controller");

const router = Router();

router.route("/validate").post(validateToken);

module.exports = router