const mongoose = require("mongoose")
const connectDb = async () => {
    try {
        const connection = await mongoose.connect("mongodb+srv://makindeayooluwa604_db_user:victorvictor@intro-to-backend.ac2iqpb.mongodb.net/")
        console.log("MongoDB connected!", connection.connection.host)
    } catch (error) {
        console.log("MongoDB connection error", error);
    }
}
module.exports = connectDb;