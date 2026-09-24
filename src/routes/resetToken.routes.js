const { Router } = require("express");
const { validateToken } = require("../controllers/resetToken.controller");

const router = Router();

// router.route("/validateToken").post(validateToken);