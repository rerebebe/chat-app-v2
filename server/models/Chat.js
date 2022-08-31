const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model("Chat", ChatSchema); // "Chat"會+s 出現在collection裡面 --> "Chats"
module.exports = Chat;
