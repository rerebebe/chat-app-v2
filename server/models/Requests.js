const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
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

const Request = mongoose.model("frdRequests", RequestSchema); // "Chat"會+s 出現在collection裡面 --> "Chats"
module.exports = Request;
