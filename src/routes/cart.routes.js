const { Router } = require("express");
const { addToCart, getCart } = require("../controllers/cart.controller");

const router = Router();

router.route("/add").post(addToCart)
router.route("/get").post(getCart)

module.exports = router;