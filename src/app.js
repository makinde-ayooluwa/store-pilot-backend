const express = require("express")
const app = express();
const authRouter = require("./routes/auth.routes")
const mailRouter = require("./routes/mailer.routes")
const wishlistRouter = require("./routes/wishlist.routes")
const storeRouter = require("./routes/store.routes")
const cors = require("cors")
const job = require("./config/cron")
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));

app.use(cors())

app.get("/", (req, res) => {
    res.status(200).json({ status: true })
    console.log("Request made to /")
})
// Add this directly in server.js
// app.post('/store/get', (req, res) => {
//     res.send("Direct route working!");
// });
app.use("/auth", authRouter);
app.use("/mail", mailRouter);
app.use("/wishlist", wishlistRouter);
app.use("/store", storeRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
job.start()
module.exports = app;