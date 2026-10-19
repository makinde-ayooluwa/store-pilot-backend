
const express = require("express");
const { initializePayment } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/initialize", initializePayment)

module.exports = router;
