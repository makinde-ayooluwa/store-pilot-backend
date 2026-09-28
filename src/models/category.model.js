const { Schema, default: mongoose } = require("mongoose");

const categorySchema = new Schema({
    name: String,
    slug: String,
    description: String,
    icon: String,
    image: String,
}, { timestamps: true });
const Category = new mongoose.model("categories", categorySchema)
module.exports = Category;