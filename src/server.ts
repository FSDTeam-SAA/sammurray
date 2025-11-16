import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "socket.io";
import { socketHandler } from "./app/helper/socket";
import app from "./app";
import http from "http";

const PORT = config.port;


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  socketHandler(io, socket);
});




const main = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    const mongo = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${mongo.connection.host}`);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error("❌ Error starting server:", error.message || error);
    process.exit(1);
  }
};

main();
