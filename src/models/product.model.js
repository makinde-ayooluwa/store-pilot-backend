const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
    name: String,
    slug: String,
    description: String,
    price: Number,
    oldPrice: Number,
    image: String,
    images: Array,
    category: String,
    // categorySlug: String,
    store: String,
    storeName: String,
    storeSlug: String,
    rating: Number,
    reviews: Number,
    stock: Number,
    lowStockThreshold: Number,
    featured: Boolean,
    status: String,
    discount: Number,
    sales: Number
}, { timestamps: true })
const Product = new mongoose.model("products", productSchema)
module.exports = Product;