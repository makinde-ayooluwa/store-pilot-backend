const Cart = require("../models/cart.model");
const User = require("../models/user.model")
const addToCart = async (req, res) => {
    try {
        const { user, items } = req.body;

        if (!user || user.trim() === "") {
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User ID not recognized"
            });
        }

        if (!items || items.length < 1) {
            return res.status(400).json({
                status: false,
                message: "Cart items can't be empty"
            });
        }

        // Check if user already has a cart
        let cart = await Cart.findOne({ user });

        if (cart) {
            // Append new items to existing cart items array 
            // (Ensure your schema field matches: 'items' or 'item')
            items.forEach((item) => cart.items.push(item));
            await cart.save();
        } else {
            // Create a new cart if one doesn't exist
            cart = await Cart.create({
                user,
                items
            });
        }

        return res.status(200).json({
            status: true,
            message: "Added to cart successfully",
            data: cart
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while adding to cart",
            error: error.message
        });
    }
};

const getCart = async (req, res) => {
    const { user } = req.body;
    if (!user || user.trim() === "") {
        return res.status(400).json({
            status: false,
            message: "User ID is required"
        });
    }

    try {
        const cartExists = await Cart.findOne({user});
        if (cartExists) {
            return res.status(200).json({
                status: true,
                message: "Cart fetched successfully", // Updated message to match the GET action
                data: cartExists
            });
        } else {
            // Option A: Return a 404 if the cart doesn't exist yet
            return res.status(404).json({
                status: false,
                message: "Cart not found for this user"
            });

            // Option B: Or automatically create an empty cart if that fits your app logic
            // const newCart = await Cart.create({ user, items: [] });
            // return res.status(201).json({ status: true, message: "Cart created", data: newCart });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = { addToCart, getCart }