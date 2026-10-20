
const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/order.controller");

router.post("/create", createOrder);
router.post("/all", getOrders);

module.exports = router;