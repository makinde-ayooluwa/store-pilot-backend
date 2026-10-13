const { WebSocketServer } = require("ws");

const socket = new WebSocketServer({
    port: process.env.SOCKET_PORT || 5000
});
const clients = {};
console.log("WebSocket server running on port 5000");

socket.on("connection", (client) => {
    // Track connections by mapping socket instances to userIds if needed, 
    // or attach the userId directly to the client socket object.

    client.on("message", (message) => {
        let parsed;
        try {
            parsed = JSON.parse(message);
        } catch (e) {
            return; // Ignore non-JSON messages
        }

        if (parsed.type === "join") {
            // 1. Store the userId directly on the client object so we can access it on close
            client.userId = parsed.userId;

            clients[parsed.userId] = client;
            console.log(`User ${parsed.userId} is online now`);

            // Broadcast updated active user list
            const keys = Object.keys(clients);
            keys.forEach((key) => {
                if (clients[key].readyState === WebSocket.OPEN) {
                    clients[key].send(JSON.stringify({
                        type: "connected_users",
                        data: keys
                    }));
                }
            });
        }
    });

    client.on("close", () => {
        // 2. Check if this client had an associated userId and remove them
        if (client.userId && clients[client.userId]) {
            delete clients[client.userId];
            console.log(`User ${client.userId} disconnected and was removed`);

            // Optional: Broadcast the updated list to remaining online users
            const keys = Object.keys(clients);
            keys.forEach((key) => {
                if (clients[key].readyState === WebSocket.OPEN) {
                    clients[key].send(JSON.stringify({
                        type: "connected_users",
                        data: keys
                    }));
                }
            });
        } else {
            console.log("An unauthenticated client disconnected");
        }
    });
});
module.exports = socket