const Store = require("../models/store.model");
const User = require("../models/user.model");
const getStore = async (req, res) => {
    try {
        const { id } = req.body;
        const storeOwner = await User.findById(id);
        if (storeOwner) {
            const store = await Store.find({ownerEmail: storeOwner.email});

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
        const exists = await Store.findOne({ ownerEmail: email });
        if (exists) {
            return res.status(400).json({
                status: false,
                message: "You already own a store. Login instead"
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
module.exports = { registerStore, getStore }