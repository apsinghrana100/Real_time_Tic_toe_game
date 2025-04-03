import express from 'express';
import Room from '../models/roomModel';


const roomRouter = express.Router();

roomRouter.post('/roomCreate',async(req,res)=>{
    const {firstName} = req.params;
  
    try {
        const newRoom = await Room.create({ firstPlayer: firstName });
        console.log("✅ Room Created:", newRoom);
        return res.status(201).json({success:true, msg:"successfully Room created", data:[]})
         // Returns the created document
      } catch (error) {
        console.error("❌ Error creating room:", error);
        return res.status(500).json({success:false, msg:"Failed to Create Room"})
      }
});



roomRouter.post("/joinRoom", async (req, res) => {
  const { secondPlayer, roomId } = req.body; // Use req.body instead of req.params

  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId: roomId }, // Find the room by roomId
      { secondPlayer: secondPlayer }, // Set the second player
      { new: true } // Return the updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }

    console.log("✅ Room Updated:", updatedRoom);
    return res.status(200).json({
      success: true,
      msg: "Successfully added second player to the room",
      data: updatedRoom,
    });

  } catch (error) {
    console.error("❌ Error updating room:", error);
    return res.status(500).json({ success: false, msg: "Failed to join the room" });
  }
});






