const { Router } = require("express");
const { getAllProduct, addProduct } = require("../controllers/product.controller");
const upload = require("../middleware/upload")
const router = Router()

router.route("/all").post(getAllProduct)
router.post(
    "/add",
    upload.array("images", 5),
    addProduct
);

module.exports = router;