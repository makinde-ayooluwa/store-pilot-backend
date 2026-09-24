const { Router } = require("express");
const { register, login, getUser, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { validateToken } = require("../controllers/resetToken.controller");

const router = Router()
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/validate-token").post(validateToken);
router.route("/getUser").post(getUser);

module.exports = router;