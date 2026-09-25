const express = require("express")
const app = express();
const authRouter = require("./routes/auth.routes")
const mailRouter = require("./routes/mailer.routes")
const cors = require("cors")
const job = require("./config/cron")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));
// List all allowed frontend domains (local & deployed)
const allowedOrigins = [
    'https://store-pilot-kappa.vercel.app', // Your Vercel frontend
    'http://localhost:5173',               // Vite dev server
    'http://localhost:3000'                // CRA dev server
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, Postman, or curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Blocked by CORS policy'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// Handle preflight OPTIONS requests across all routes
app.options('*', cors());

app.get("/", (req, res) => {
    res.status(200).json({ status: true })
    console.log("Request made to /")
})
app.use("/auth", authRouter);
app.use("/mail", mailRouter);

job.start()
module.exports = app;