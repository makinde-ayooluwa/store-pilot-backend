const User = require("../models/user.model");

const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        if (fullname == "") {
            return res.status(500).json({ statusCode: 500, message: "Fullname is required" });
        }
        if (email == "") {
            return res.status(500).json({ statusCode: 500, message: "Email is required" });
        }
        if (password == "") {
            return res.status(500).json({ statusCode: 500, message: "Password is required" });
        }
        if (role == "") {
            return res.status(500).json({ statusCode: 500, message: "Role is required" });
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(500).json({ statusCode: 500, message: "User exists" });
        }
        const newUser = await User.create({ fullname, email, password, role });
        return res.status(200).json({ statusCode: 200, _id: newUser._id });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error })
        console.log(error);
    }
}
const login = (req, res) => {

}
module.exports = { register, login }