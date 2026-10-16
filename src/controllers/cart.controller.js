const Cart = require("../models/cart.model");
const User = require("../models/user.model")
const addToCart = async (req, res) => {
    try {
        const { user, item } = req.body;

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

        if (!item || !item._id) {
            return res.status(400).json({
                status: false,
                message: "Cart item and valid item ID are required"
            });
        }

        // Check if user already has a cart
        let cart = await Cart.findOne({ user });

        if (cart) {
            console.log("Full cart", cart)
            // FIX: Convert cItem._id to string to avoid MongoDB object vs JSON string type mismatch
            const existingItem = cart.items.find(cItem => cItem._id == item._id);

            if (existingItem) {
                console.log(`Found existing one`, existingItem._id);
                // 1. Update the quantity
                existingItem.quantity += (item.quantity || 1);

                // FIX: Tell Mongoose explicitly that the 'items' array was updated
                cart.markModified('items');
            } else {
                // If it doesn't exist, add the new item to the cart with a fallback quantity
                cart.items.push({ ...item, quantity: item.quantity || 1 });
            }

            // This will now successfully write the new quantity to the database
            await cart.save();


            // Single save call for either branch
            await cart.save();

        } else {
            // Create a new cart if one doesn't exist
            cart = await Cart.create({
                user,
                items: [
                    { ...item, quantity: item.quantity || 1 } // FIX: Ensure quantity is saved on cart initialization
                ]
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
        const cartExists = await Cart.findOne({ user });
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
const updateQuantity = async (req, res) => {
    try {
        const {user, productId, quantity } = req.body;
        const seen = await Cart.findOne({user});
        if(seen){
            const prd = seen.items.find((x)=>x._id == productId);
            if(prd){
                prd.quantity = quantity;
            }
            seen.save();
        }

        return res.status(200).json({
            status: true,
            message: "Quantity updated"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error occured while updating quantity"
        })
    }
}
const removeFromCart = async (req, res) => {
    try {
        const { user, productId } = req.body;
        const seen = await Cart.findOne({ user });
        if (seen) {
            const newItems = seen.items.filter((x) => x._id != productId);
            seen.items = newItems;
            await seen.save();
            return res.status(200).json({
                status: true,
                message: "Product removed from cart"
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error occured while removing product from cart"
        })
    }
}
const clearCart = async (req, res) => {
    const { user } = req.body;
    try {
        const seen = await Cart.findOne({ user });
        if (seen) {
            seen.items = [];
            seen.save();
        }
        return res.status(200).json({
            status: true,
            message: "Cart cleared successfully"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error occured while removing product from cart"
        })
    }
}
module.exports = { addToCart, getCart, updateQuantity, removeFromCart, clearCart }