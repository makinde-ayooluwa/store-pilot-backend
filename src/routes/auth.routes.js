const { Router } = require("express");
const { register, login, checkStore, getUser, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { validateToken, requestToken } = require("../controllers/resetToken.controller");
const { send } = require("../controllers/mailer.controller");

const router = Router()
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/check-store").post(checkStore);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/validate-token").post(validateToken);
router.route("/request-token").post(requestToken);
router.route("/request-mail").post(send);
router.route("/getUser").post(getUser);

module.exports = router;
