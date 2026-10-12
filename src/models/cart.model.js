const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
    user: String,
    items: Array
}, {timestamps: true})

const Cart = new mongoose.model("carts", cartSchema)

module.exports = Cart;