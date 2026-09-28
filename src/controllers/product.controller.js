const Product = require("../models/product.model")

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: true, data: products });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch products" })
    }
}
const addProduct = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            category,
            price,
            stock,
            lowStockThreshold,
            status, store
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                status: false,
                message: "Product name is required"
            });
        }

        if (!slug || !slug.trim()) {
            return res.status(400).json({
                status: false,
                message: "Product slug is required"
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                status: false,
                message: "Product description is required"
            });
        }

        if (!category) {
            return res.status(400).json({
                status: false,
                message: "Product category is required"
            });
        }

        if (price === undefined || price === null || price === "") {
            return res.status(400).json({
                status: false,
                message: "Product price is required"
            });
        }

        if (stock === undefined || stock === null || stock === "") {
            return res.status(400).json({
                status: false,
                message: "Product stock is required"
            });
        }

        if (
            lowStockThreshold === undefined ||
            lowStockThreshold === null ||
            lowStockThreshold === ""
        ) {
            return res.status(400).json({
                status: false,
                message: "Low stock threshold is required"
            });
        }

        if (!status || !status.trim()) {
            return res.status(400).json({
                status: false,
                message: "Product status is required"
            });
        }
        const images = req.files;
        console.log(images)
        const newProduct = await Product.create({
            name,
            slug,
            description,
            category,
            price,
            stock,
            lowStockThreshold,
            status: status ?? "active",
            image: images[0],
            images,
            store
        })
        return res.status(200).json({
            status: true,
            message: "Product created successfully"
        });
        /**
         * Handle Images uploads
         * Take names
         * Add product
         */
    } catch (error) {
        return res.status(500).json({
            status: true,
            message: "Product error",
            data: error
        });
    }
}
module.exports = { getAllProduct, addProduct }