const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  passWord: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", UserSchema); // "Chat"會+s 出現在collection裡面 --> "Chats"
module.exports = User;
