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
            status,
            store,
            storeName,
            storeSlug
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

        // if (!category) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Product category is required"
        //     });
        // }

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

        if (status.trim() == "") {
            return res.status(400).json({
                status: false,
                message: "Product status is required"
            });
        }
        const exists = await Product.findOne({ slug });
        if (exists) {
            return res.status(400).json({
                status: false,
                message: "Product with the slug exists already."
            });
        }
        const images = req.files;
        // console.log(images)
        const imagesToAdd = []
        images.forEach(({ path }) => {
            imagesToAdd.push(path)
        })
        console.log(imagesToAdd)
        console.log(imagesToAdd)
        const newProduct = await Product.create({
            name,
            slug,
            description,
            category,
            price,
            stock,
            lowStockThreshold,
            status: status ?? "active",
            image: `${images[0].path}`,
            images: imagesToAdd,
            store,
            storeName,
            storeSlug
        })
        return res.status(200).json({
            status: true,
            message: "Product created successfully",
            data: {
                _id: newProduct._id
            }
        });
        /**
         * Handle Images uploads
         * Take names
         * Add product
         */
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Product error occured",
            data: error
        });
    }
}
const editProduct = async (req, res) => {
    try {
        const { _id, name, description, price, stock, slug, status } = req.body;
        const images = req.files;
        // console.log(images)
        const imagesToAdd = []
        images.forEach(({ path }) => {
            imagesToAdd.push(path)
        })
        const updated = await Product.findByIdAndUpdate(
            _id,
            {
                name,
                description,
                price,
                stock,
                slug,
                status,
                image: imagesToAdd?.[0], // Safe access in case array is empty/undefined
                images: imagesToAdd
            },
            {
                new: true,          // Returns the updated document instead of the old one
                runValidators: true // Enforces model schema validations (e.g., min price, required fields)
            }
        );
        return res.status(200).json({
            status: true,
            message: "Product edited successfully",
            data: {
                _id: updated._id
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Product editing error occured",
            data: error
        });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await Product.findByIdAndDelete(id)
        if (deleted) {
            return res.status(200).json({
                status: true,
                message: "Product deleted successfully",

            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Product deletion error occured",
            data: error
        });
    }
}
module.exports = { getAllProduct, addProduct, editProduct, deleteProduct }