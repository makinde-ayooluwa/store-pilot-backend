const { Router } = require("express");
const { getAllProduct, addProduct, editProduct, deleteProduct } = require("../controllers/product.controller");
const upload = require("../middleware/upload")
const router = Router()

router.route("/all").post(getAllProduct)
router.post(
    "/add",
    upload.array("images"),
    addProduct
);
router.post("/edit",
    upload.array("images"),
    editProduct
)
router.route("/delete").post(deleteProduct)

module.exports = router;