const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  friend: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model("room", RoomSchema); // "Chat"會+s 出現在collection裡面 --> "Chats"
module.exports = Room;
