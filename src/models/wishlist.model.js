const { Schema, default: mongoose } = require("mongoose");

const wishlistSchema = new Schema({
    userId: String,
    products: Array
},
{timestamps: true})
const Wishlist = mongoose.model("wishlists", wishlistSchema);
module.exports = Wishlist;