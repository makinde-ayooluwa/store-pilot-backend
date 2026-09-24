const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new Schema(
    {
        fullname: String,
        email: String,
        phone: String,
        password: String,
        role: {
            type: String,
            enum: ['user', 'admin'], // Only allows values in this list
            default: 'user'                   // Defaults to 'user' if no role is provided
        },
        picture: String,
        status: {
            type: String,
            default: "inactive"
        },
        email_verified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date,
            default: Date
        }
    },
    { timestamps: true }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // next();
});
userSchema.methods.confirmPassword = async function (password) {
    const valid = await bcrypt.compare(password, this.password);
    return valid;
};
const User = mongoose.model("users", userSchema);
module.exports = User;