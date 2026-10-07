const express = require("express")
const app = express();
const path = require("path")
const authRouter = require("./routes/auth.routes")
const mailRouter = require("./routes/mailer.routes")
const wishlistRouter = require("./routes/wishlist.routes")
const storeRouter = require("./routes/store.routes")
const productRouter = require("./routes/product.routes")
const categoryRouter = require("./routes/category.routes")
const cors = require("cors")
const job = require("./config/cron")
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/src/uploads", express.static(path.join(__dirname, "uploads")));
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",

    // Your production Vercel frontend
    "https://store-pilot-kappa.vercel.app",

    // Your custom domain if you have one
    // "https://storepilot.com",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin
            // e.g. Postman, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked for origin: ${origin}`)
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],

        credentials: true
    })
);

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
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
job.start()
module.exports = app;