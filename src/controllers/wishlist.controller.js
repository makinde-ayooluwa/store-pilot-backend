const Wishlist = require("../models/wishlist.model");

const addWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const exists = await Wishlist.findOne({ userId });
        if (exists) {
            const products = exists.products;
            products.push(productId);
            exists.save();
            res.status(200).json({ status: true, message: "Wishlist updated" })
        } else {
            await Wishlist.create({ userId, products: [productId] });
            res.status(200).json({ status: true, message: "Wishlist updated" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}
const getWishlist = async (req, res) => {
    const { userId } = req.body;
    try {
        const data = await Wishlist.findOne({ userId })
        if (data) {
            return res.status(200).json({ status: true, data })
        }
    } catch (error) {
        return res.status(500).json({ status: false, error })
    }
}
module.exports = { addWishlist }