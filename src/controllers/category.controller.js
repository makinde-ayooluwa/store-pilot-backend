const Category = require("../models/category.model")

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch categories", data: error });
    }
}
const addCategory = async (req, res) => {
    try {
        let { name, slug, description, icon, image } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ status: false, message: "Category name is required" });
        }
        if (!slug?.trim()) {
            return res.status(400).json({ status: false, message: "Category slug is required" });
        } if (!description?.trim()) {
            return res.status(400).json({ status: false, message: "Category description is required" });
        } if (!icon?.trim()) {
            return res.status(400).json({ status: false, message: "Category icon is required" });
        } if (!image?.trim()) {
            return res.status(400).json({ status: false, message: "Category image is required" });
        }
        name = name.trim();
        slug = slug.trim().toLowerCase();
        description = description.trim();
        icon = icon.trim();
        image = image.trim();

        const exists = await Category.findOne({ $or: [{ name }, { slug }] });
        if (exists) {
            return res.status(409).json({ status: false, message: "A category with this name or slug already exists" });
        }
        const newCategory = await Category.create({ name, slug, description, icon, image });
        return res.status(201).json({ status: true, message: "Category created successfully", data: newCategory });
    }
    catch (error) {
        console.error("ADD CATEGORY ERROR:", error);
        return res.status(500).json({ status: false, message: "Internal server error occurred while creating category" });
    }
};

// const getCategoryBySlug = async (req, res) => {

//     try {
//         const { slug } = req.params;
//         if (slug == "") {
//             return res.status(500).json({ status: true, message: "Slug is required" })
//         }
//         const category = await Category.findOne({ slug });
//         if(!category){
//             return res.status(200).json({ status: true, message: "Category not found" })
//         }
//         return res.status(200).json(category )
//     } catch (error) {
//         return res.status(500).json({ status: true, message: "Category find error occured" })
//     }
// }

module.exports = { getAllCategories, addCategory };