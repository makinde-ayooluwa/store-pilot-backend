const { Router } = require("express");
const { registerStore, getStore } = require("../controllers/store.controller");

const router = Router();

router.route("/getStore").post(getStore);
router.route("/register").post(registerStore);

module.exports = router;