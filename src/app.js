const express = require("express")
const app = express();
app.get("/",(req, res)=>{
    res.status(200).json({status: true})
    console.log("Request made to /")
})
module.exports = app;