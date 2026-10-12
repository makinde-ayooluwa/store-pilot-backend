const { Schema, default: mongoose } = require("mongoose");

const storeSchema = new Schema({
    name: String,
    slug: String,
    logo: String,
    banner: String,
    ownerName: String,
    ownerEmail: String,
    phone: String,
    category: String,
    location: String,
    description: String,
    categories: Array,
    currency: {
        type: String,
        default: "NGN"
    },
    verified: {
        type: Boolean,
        default: false
    },
    country: {
        type: String,
        default: "Nigeria"
    },
    city: String,
    state: String
}, { timestamps: true })

const Store = new mongoose.model("stores", storeSchema);
module.exports = Store;