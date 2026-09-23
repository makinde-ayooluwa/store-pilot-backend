const { WebSocketServer } = require("ws");

const socket = new WebSocketServer({
    port: process.env.SOCKET_PORT || 5000
});

console.log("WebSocket server running on port 5000");

socket.on("connection", (client) => {
    console.log("Client connected");

    client.on("message", (message) => {
        console.log("Received:", message.toString());

        client.send("Hello from StorePilot WebSocket server");
    });

    client.on("close", () => {
        console.log("Client disconnected");
    });
});
module.exports = socket