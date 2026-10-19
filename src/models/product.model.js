
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
    sales: Number,

    // Delivery pricing for this product
    deliveryPricing: {
        enabled: {
            type: Boolean,
            default: true
        },
        rules: [{
            minQuantity: {
                type: Number,
                required: true,
                min: 1
            },
            maxQuantity: {
                type: Number,
                default: null
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }]
    }

}, { timestamps: true });

const Product = mongoose.model("products", productSchema);

module.exports = Product;
