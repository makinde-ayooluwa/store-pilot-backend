const { Router } = require("express");
const { registerStore, getStore, getAllStore, getProducts, updateStore } = require("../controllers/store.controller");
const upload = require("../middleware/upload")
const router = Router();

router.route("/all").post(getAllStore);
router.route("/getStore").post(getStore);
router.route("/getProducts").post(getProducts);
router.route("/register").post(registerStore);
router.post("/update", upload.array("images"), updateStore)

module.exports = router;