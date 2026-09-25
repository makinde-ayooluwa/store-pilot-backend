const { Router } = require("express");
const { addWishlist } = require("../controllers/wishlist.controller");

const router = Router();

router.route("/add").post(addWishlist)
router.route("/").post(addWishlist)

module.exports = router;