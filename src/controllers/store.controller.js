const Product = require("../models/product.model");
const Store = require("../models/store.model");
const User = require("../models/user.model");
const getAllStore = async (req, res) => {
    try {
        const response = await Store.find();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ status: false, message: "Stores not found" })
    }
}
const getStore = async (req, res) => {
    try {
        const { id } = req.body;
        const storeOwner = await User.findById(id);
        if (storeOwner) {
            const store = await Store.find({ ownerEmail: storeOwner.email });

            if (!store) {
                return res.status(404).json({
                    status: false,
                    message: "Store not found"
                });
            }

            return res.status(200).json({
                status: true,
                data: store
            });
        }
        // Find document by MongoDB _id


    } catch (error) {
        console.error("GET STORE ERROR:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to retrieve store details"
        });
    }
};
const getProducts = async (req, res) => {
    const { id } = req.body;
    try {
        const products = await Product.find({ store: id });
        res.status(200).json({ status: true, data: products });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch store products" })
    }
}
const registerStore = async (req, res) => {
    try {
        const {
            storeName,
            slug,
            ownerName,
            email,
            phone,
            category,
            location,
            description
        } = req.body;

        // 1. Check if the user already owns a store (Return 400 instead of 500)
        const exists = await Store.findOne({ ownerEmail: email, slug });
        if (exists) {
            return res.status(400).json({
                status: false,
                message: "A store with the name already exists or you own a store already. Login instead"
            });
        }

        // 2. Create the new store
        const newStore = await Store.create({
            name: storeName,
            slug,
            ownerName,
            ownerEmail: email,
            phone,
            category,
            location,
            description
        });

        return res.status(200).json({
            status: true,
            message: "Store created successfully.",
            storeId: newStore._id
        });

    } catch (error) {
        console.error("REGISTER STORE ERROR:", error);

        // Handle MongoDB duplicate key error (e.g., unique slug collision)
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                message: "A store with this name or owner email already exists."
            });
        }

        return res.status(500).json({
            status: false,
            message: "An error occurred while creating the store."
        });
    }
};
const updateStore = async (req, res) => {
    try {
        const {
            _id,
            name,
            category,
            location,
            description,
            address,
            currency,
            country,
            city,
            state
        } = req.body;

        if (!_id) {
            return res.status(400).json({
                status: false,
                message: "Store ID is required."
            });
        }

        const updateData = {
            name,
            category,
            location,
            description,
            address,
            currency,
            country,
            city,
            state
        };

        // Uploaded files
        if (req.files && req.files.length > 0) {
            console.log("UPLOADED IMAGES:", req.files);

            // First image = logo
            if (req.files[0]) {
                updateData.logo = req.files[0].path;
            }

            // Second image = banner
            if (req.files[1]) {
                updateData.banner = req.files[1].path;
            }
        }

        const updated = await Store.findByIdAndUpdate(
            _id,
            updateData ,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: "Store not found."
            });
        }

        return res.status(200).json({
            status: true,
            message: "Store updated successfully",
            data: updated
        });

    } catch (error) {
        console.error("UPDATE STORE ERROR:", error);

        return res.status(500).json({
            status: false,
            message: "Internal server error occurred while updating store."
        });
    }
};

module.exports = { registerStore, getStore, getAllStore, getProducts, updateStore }