
import { Server } from "socket.io";

let io;

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174"
            ],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);


        socket.on("joinOrder", (orderId) => {
            if (typeof orderId === "string" && orderId.length > 0) {
                socket.join(`order:${orderId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
}
