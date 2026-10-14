const { Router } = require("express");
const { addToCart, getCart, clearCart, updateQuantity, removeFromCart } = require("../controllers/cart.controller");

const router = Router();

router.route("/add").post(addToCart)
router.route("/get").post(getCart)
router.route("/update-quantity").post(updateQuantity)
router.route("/remove").post(removeFromCart)
router.route("/clear").post(clearCart)

module.exports = router;