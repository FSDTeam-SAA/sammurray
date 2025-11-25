import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "socket.io";
import { socketHandler } from "./app/helper/socket";
import app from "./app";
import http from "http";
import Property from "./app/modules/property/property.model";
import '../src/app/helper/subscriptionCron';


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

    try {
      await Property.collection.createIndex({ extraLocation: "2dsphere" });
      console.log("✅ Geospatial index created successfully");
    } catch (indexError: any) {
      console.error("❌ Error creating geospatial index:", indexError.message);
    }

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