import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
import connectDB from "./utils/connection.js";
import Room from "./src/models/roomModel.js";
import roomRouter from "./src/routes/roomRoute.js";
import bodyParser from "body-parser";
import cors from "cors";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend access
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

let board = Array(9).fill(null);
let isXTurn = true; 
const games = {}; // Store game data for each room
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // socket.emit("joinroom", { newBoard: board, nextTurn: isXTurn });

  socket.on("joinroom", ({roomId,firstPlayer,secondPlayer}) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    if(!games[roomId]){
      games[roomId]={
        board: Array(9).fill(null),
        isXTurn: true,
      }
    }
    console.log("pa",firstPlayer)
    io.to(roomId).emit("updateGame",games[roomId])
    io.to(roomId).emit("updateName",{firstPlayer,secondPlayer});
  });

  socket.on("makeMove",({roomId, board, isXTurn})=>{
    // socket.join(roomId);
    if (games[roomId]) {
      games[roomId].board = board;
      games[roomId].isXTurn = isXTurn;

      io.to(roomId).emit("updateGame", games[roomId]);
    }
  })
  socket.on("resetgame",(roomId) =>{
    if(games[roomId]){
      games[roomId].board = Array(9).fill(null);
      games[roomId].isXTurn = !isXTurn;
      io.to(roomId).emit( "updateGame",games[roomId])
    }

  
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api", roomRouter);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error(
      "❌ Server failed to start due to DB connection error:",
      error
    );
    process.exit(1);
  }
};

startServer();
