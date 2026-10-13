const { WebSocketServer } = require("ws");

const socket = new WebSocketServer({
    port: process.env.SOCKET_PORT || 5000
});
const clients = {};
console.log("WebSocket server running on port 5000");

socket.on("connection", (client) => {
    client.on("message", (message) => {
        const parsed = JSON.parse(message) ?? message;
        if (parsed.type == "join") {
            clients[parsed.userId] = client;
            console.log(`User ${parsed.userId} is online now`);
        }
    });

    client.on("close", () => {
        console.log("Client disconnected");
    });
});
module.exports = socket