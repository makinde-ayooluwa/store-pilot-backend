const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model")

const addToCart = async (req, res) => {
    try {
        const { user, item } = req.body;

        if (!user || typeof user !== "string" || !user.trim()) {
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            });
        }

        if (!item?._id) {
            return res.status(400).json({
                status: false,
                message: "A valid product ID is required"
            });
        }

        const userExists = await User.findById(user);

        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User ID not recognized"
            });
        }

        // Fetch the actual product from MongoDB
        const product = await Product.findById(item._id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        const quantity = Number(item.quantity ?? 1);

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                status: false,
                message: "Quantity must be a positive integer"
            });
        }

        // Use current database product data, including deliveryPricing
        const productData = product.toObject();

        let cart = await Cart.findOne({ user });

        if (!cart) {
            cart = await Cart.create({
                user,
                items: [{
                    ...productData,
                    quantity
                }]
            });
        } else {
            const existingItem = cart.items.find(
                cartItem =>
                    String(cartItem._id) === String(product._id)
            );

            if (existingItem) {
                existingItem.quantity =
                    Number(existingItem.quantity || 0) + quantity;

                // Refresh product details in the existing cart item
                Object.assign(existingItem, productData);
                existingItem.quantity =
                    Number(existingItem.quantity || 0);

                // Preserve the updated quantity explicitly
                existingItem.quantity =
                    Number(cart.items.find(
                        cartItem =>
                            String(cartItem._id) === String(product._id)
                    ).quantity);
            } else {
                cart.items.push({
                    ...productData,
                    quantity
                });
            }

            cart.markModified("items");
            await cart.save();
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
        const { user, items } = req.body;
        const seen = await Cart.findOneAndUpdate({user}, { items });
        if (seen) {
            console.log(seen)
            return res.status(200).json({
                status: true,
                message: "Quantity updated"
            })
        }


    } catch (error) {
        console.log("Error now", error)
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