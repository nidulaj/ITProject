// utils/socket.js
import { Server } from "socket.io";

let io; // shared instance

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // --- join a room by user_code ---
    socket.on("join_room", (userCode) => {
      if (!userCode) return;
      socket.join(userCode);
      console.log(`✅ Socket ${socket.id} joined room ${userCode}`);
    });

    // --- leave a room (e.g. logout / user switch) ---
    socket.on("leave_room", (userCode) => {
      if (!userCode) return;
      socket.leave(userCode);
      console.log(`🚪 Socket ${socket.id} left room ${userCode}`);
    });

    // --- relay a chat message to all members of the room ---
    socket.on("send_message", (data) => {
      if (!data?.user_code) {
        console.warn("⚠️ send_message without user_code", data);
        return;
      }
      io.to(data.user_code).emit("receive_message", data);
      console.log(`📨 Message relayed to room ${data.user_code}: ${data.message}`);
    });

    // --- disconnect logging ---
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket(server) first.");
  }
  return io;
}
