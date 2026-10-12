const { Router } = require("express");
const { addToCart } = require("../controllers/cart.controller");

const router = Router();

router.route("/add").post(addToCart)

module.exports = router;