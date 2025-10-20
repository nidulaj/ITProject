import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // --- join a room by user_code ---
    socket.on("join_room", (userCode) => {
      if (!userCode) return;
      socket.join(userCode);
    });

    // --- join customer notification room ---
    socket.on("join_customer_room", (customerId) => {
      if (!customerId) return;
      const roomName = `customer_${customerId}`;
      socket.join(roomName);
    });

    // --- leave customer notification room ---
    socket.on("leave_customer_room", (customerId) => {
      if (!customerId) return;
      const roomName = `customer_${customerId}`;
      socket.leave(roomName);
    });

    // --- leave a room (e.g. logout / user switch) ---
    socket.on("leave_room", (userCode) => {
      if (!userCode) return;
      socket.leave(userCode);
    });

    // --- relay a chat message to all members of the room ---
    socket.on("send_message", (data) => {
      if (!data?.user_code) {
        return;
      }
      io.to(data.user_code).emit("receive_message", data);
    });

    // --- disconnect handling ---
    socket.on("disconnect", () => {
      
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
