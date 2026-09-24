const ResetToken = require("../models/resetToken.model")
const requestToken = async (userId) => {
    const token = "RSTK-" + Math.floor(Math.random() * 23112010);
    await ResetToken.create({ userId, token })
    return {
        userId,
        token
    }
}
const validateToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(200).json({ status: false, message: "Token missing" });
        }

        const exists = await ResetToken.findOne({ token });

        if (exists) {
            return res.status(200).json({
                userId: exists.userId,
                token: exists.token,
                status: true
            });
        }

        // Return status 200 with status: false so Axios resolves without throwing an error
        return res.status(200).json({
            status: false,
            message: "Invalid or expired token"
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error during validation"
        });
    }
};
module.exports = { requestToken, validateToken }