const { Router } = require("express");
const { addToCart, getCart, updateQuantity, removeFromCart } = require("../controllers/cart.controller");

const router = Router();

router.route("/add").post(addToCart)
router.route("/get").post(getCart)
router.route("/update-quantity").post(updateQuantity)
router.route("/remove").post(removeFromCart)

module.exports = router;