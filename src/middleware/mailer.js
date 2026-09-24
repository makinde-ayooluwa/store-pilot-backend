const nodemailer = require("nodemailer")

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "makindeayooluwa604@gmail.com",
        pass: "aswp rysk uuao awvn"
    }
})
module.exports = mailer;