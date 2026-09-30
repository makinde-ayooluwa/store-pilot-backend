const { Router } = require("express");
const { registerStore, getStore, getAllStore, getProducts } = require("../controllers/store.controller");

const router = Router();

router.route("/all").post(getAllStore);
router.route("/getStore").post(getStore);
router.route("/getProducts").post(getProducts);
router.route("/register").post(registerStore);

module.exports = router;