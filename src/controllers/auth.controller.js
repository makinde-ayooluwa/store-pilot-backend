const User = require("../models/user.model");
const { requestToken } = require("./resetToken.controller");
const { sendMail } = require("./mailer.controller")
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
        return res.status(200).json({ statusCode: 200, _id: newUser._id, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Internal server error occured" })
        console.log(error);
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email == "") return res.status(500).json({ statusCode: 500, message: "Email is required" });
        if (password == "") return res.status(500).json({ statusCode: 500, message: "Password is required" });
        const exists = await User.findOne({ email });
        if (exists) {
            // 1. MUST use 'await' because bcrypt/password verification is asynchronous
            const isMatch = await exists.confirmPassword(password);

            // 2. Use status code 401 (Unauthorized) for bad credentials, not 500
            if (!isMatch) {
                return res.status(401).json({ statusCode: 401, message: "Invalid email or password" });
            }

            return res.status(200).json({ statusCode: 200, message: "Login successful", _id: exists._id });
        } else {
            // 3. Use status code 401 or 404 instead of 500 for non-existent user
            return res.status(401).json({ statusCode: 401, message: "Invalid email or incorrect password" });
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Internal server error." })
        console.log(error);
    }
}
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ statusCode: 400, message: "Email is required" });
        }

        // 1. Use findOne instead of find (returns an object, not an array)
        const user = await User.findOne({ email });
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "If an account with that email exists, a password reset link has been sent.",
            userId: user._id
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: "An internal server error occurred while sending the email.",
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { password, userId } = req.body;

        // 1. Find the user document
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // 2. Assign the new password (triggering pre('save') middleware)
        user.password = password;
        await user.save();

        // 3. (Optional) Delete used reset tokens here so they can't be reused

        return res.status(200).json({
            status: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};
const getUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}
module.exports = { register, login, getUser, forgotPassword, resetPassword }