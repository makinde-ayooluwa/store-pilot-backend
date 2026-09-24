const app = require("./app")
const connectDb = require("./config/db")
const socket = require("./config/socket")
const dotenv = require("dotenv");
dotenv.config({
    path: "./.env"
})
const startServer = () => {
    connectDb();
    app.listen(process.env.SERVER_PORT || 8000, () => {
        console.log(`Server listening on port ${process.env.SERVER_PORT || 8000}`);
    })
}

startServer()