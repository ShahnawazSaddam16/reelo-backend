const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
// TODO FOR NOW GETTING THE SECRET DIRECTLY IN FUTURE CREATED A ZOD VALIDATED CONFIG FILE TO LOAD THESE
const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET){
  throw new Error("JWT_SECRET environment variable is required");
}
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(token,JWT_SECRET)

      if(!decoded){
        return next(new Error("Invalid JWT token") )
      }

      socket.user = decoded;

      next();
    } catch (error) {
      console.error(error,"In socket connection")
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {

    socket.on("register", (userId) => {
      socket.join(userId);
    
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

module.exports = { initSocket, getIO };