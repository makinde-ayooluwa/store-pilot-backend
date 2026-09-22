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
            enum: ['user', 'admin', 'seller'], // Only allows values in this list
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
        lastLogin: Date
    },
    { timestamps: true }
)
userSchema.pre("save",(next)=>{
    if(!this.isModified(this.password)){
        return;
    }
    const salt = bcrypt.genSalt(10);
    const newPwd = bcrypt.hash(this.password, salt)
    this.password = newPwd;
})
const User = mongoose.model("users", userSchema);
module.exports = User;