const { WebSocketServer } = require("ws");

const socket = new WebSocketServer({
    port: process.env.SOCKET_PORT || 5000
});
const clients = new Set();
console.log("WebSocket server running on port 5000");

socket.on("connection", (client) => {
    console.log("Client connected", client._events);
    clients.add(client)
    console.log("CLIENTS CONNECTED", clients)
    client.on("message", (message) => {
        console.log("Received:", message?.toString() ?? message?.toJSON());
        client.send(`Hello from StorePilot WebSocket server. Message received was: ${message?.toString() ?? message?.toJSON()}`);
        
    });

    client.on("close", () => {
        console.log("Client disconnected");
    });
});
module.exports = socket