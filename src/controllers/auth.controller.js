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
        res.status(500).json({ statusCode: 500, message: "Internal server error" })
        console.log(error);
    }
}
const forgotPassword = async (req, res) => {
    try {
        const { email, to } = req.body;

        if (!email) {
            return res.status(400).json({ statusCode: 400, message: "Email is required" });
        }

        // 1. Use findOne instead of find (returns an object, not an array)
        const user = await User.findOne({ email });

        // 2. Return a uniform message regardless of whether user exists (prevents account enumeration)
        if (!user) {
            return res.status(200).json({
                statusCode: 200,
                message: "If an account with that email exists, a password reset link has been sent.",
            });
        }

        // 3. Await token generation
        const tokenData = await requestToken(user._id);
        const token = tokenData.token;

        // 4. Use environment variable for domain with localhost fallback
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password/${token}`;

        const subject = "Forgot password -- StorePilot";
        const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; width: 100%; }
        .email-wrapper { width: 100%; padding: 20px 0; background-color: #f4f4f7; }
        .email-content { max-width: 570px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
        h1 { color: #333333; font-size: 20px; font-weight: bold; margin-top: 0; }
        p { color: #51545e; font-size: 15px; line-height: 1.5; }
        .btn-container { margin: 25px 0; text-align: center; }
        .btn { background-color: #22c55e; color: #ffffff; display: inline-block; padding: 12px 24px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 6px; }
        .subtext { font-size: 12px; color: #6b7280; margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 15px; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <h1>Password Reset Request</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password for your Store Pilot account. Click the button below to choose a new password:</p>
          
          <div class="btn-container">
            <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
          </div>

          <p>This password reset link will expire in 1 hour.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          
          <div class="subtext">
            <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

        // 5. Await email dispatch
        await sendMail(subject, to, message);

        // 6. Send success response back to Express client
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "An internal server error occurred while sending the email.",
        });
    }
};
const resetPassword = async (req, res) => {
    const { password, userId } = req.body;
    const updated = await User.findByIdAndUpdate(userId, { password });
    if (updated) {
        res.status(200).json({
            status: true
        })
    } else {
        res.status(500).json({
            status: false
        })
    }
}
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