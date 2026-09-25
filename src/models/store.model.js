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
    description: String
}, { timestamps: true })

const Store = new mongoose.model("stores", storeSchema);
module.exports = Store;