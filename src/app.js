const express = require("express")
const app = express();
const authRouter = require("./routes/auth.routes")
const mailRouter = require("./routes/mailer.routes")
const cors = require("cors")
const job = require("./config/cron")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow cookies/headers if needed
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.get("/", (req, res) => {
    res.status(200).json({ status: true })
    console.log("Request made to /")
})
app.use("/auth", authRouter);
app.use("/mail", mailRouter);

job.start()
module.exports = app;