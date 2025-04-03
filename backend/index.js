import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import connectDB from "./utils/connection.js"; 
import Room from "./src/models/roomModel.js";



const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server failed to start due to DB connection error:", error);
    process.exit(1); 
  }
};

startServer(); 
