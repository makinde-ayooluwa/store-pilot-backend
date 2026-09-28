const { Router } = require("express");
const { getAllCategories, addCategory, getCategoryBySlug } = require("../controllers/category.controller");

const router = Router();
router.route("/all").post(getAllCategories);
router.route("/add").post(addCategory);

module.exports = router;