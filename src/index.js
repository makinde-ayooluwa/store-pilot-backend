const app = require("./app")
const connectDb = require("./config/db")
const socket = require("./config/socket")
const startServer = ()=>{
    // connectDb();
    app.listen(8000, ()=>{
        console.log("Server listening on port 8000");
    })
}
startServer()