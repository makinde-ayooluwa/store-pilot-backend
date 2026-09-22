const express = require("express")
const app = express();
const authRouter = require("./routes/auth.routes")
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).json({ status: true })
    console.log("Request made to /")
})
app.use("/auth", authRouter);

module.exports = app;