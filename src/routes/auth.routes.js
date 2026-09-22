const { Router } = require("express");
const { register, login, getUser } = require("../controllers/auth.controller");

const router = Router()
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getUser").post(getUser);

module.exports = router;