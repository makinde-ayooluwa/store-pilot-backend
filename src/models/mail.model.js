const { Schema, default: mongoose } = require("mongoose");
// const bcrypt = require("bcrypt")
const mailSchema = new Schema(
    {
        to: String,
        subject: String,
        message: String,
        password: String,
    },
    { timestamps: true }
)
// mailSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return;
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     // next();
// });
// mailSchema.methods.confirmPassword = async function (password) {
//     const valid = await bcrypt.compare(password, this.password);
//     return valid;
// };
const Mail = mongoose.model("mails", mailSchema);
module.exports = Mail;