const { Router } = require("express");
const { registerStore, getStore, getAllStore, getProducts, updateStore } = require("../controllers/store.controller");

const router = Router();

router.route("/all").post(getAllStore);
router.route("/getStore").post(getStore);
router.route("/getProducts").post(getProducts);
router.route("/register").post(registerStore);
router.route("/update").post(updateStore);

module.exports = router;