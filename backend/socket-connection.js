const socketIo = require("socket.io");

//Chat odaları ve mesajlaşma işlemleri kullanmak için socket.io'yu kullanıyoruz.
let io = null;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: ['http://localhost:8080'], // İzin verilen kaynakları buraya ekleyin // localhost:8080 Vue.js uygulamasının çalıştığı port
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("joinRoom", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`Socket ${socket.id} joined room: ${chatRoomId}`);
    });

    socket.on("sendMessage", async (messageData, callback) => {
      console.log("New message received:", messageData);
      try {
        const message = { ...messageData };
        io.to(messageData.chatRoom).emit("receiveMessage", message);
        callback({ status: "success" });
      } catch (error) {
        console.error("Error processing message:", error);
        callback({ status: "error", error });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { initializeSocket };
