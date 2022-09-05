const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
// set up mongoDB
const mongoose = require("mongoose");
//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://default-user:regina7968@cluster0.xrxnc.mongodb.net/chat?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
const ChatModel = require("./models/Chat");
const UserModel = require("./models/User");
const RoomModel = require("./models/Room");
const RequestModel = require("./models/Requests");

app.use(cors());
app.use(express.json());
//---------Scoket.io from here--------------//
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

// io.emi will emit to all the connected user
io.on("connection", (socket) => {
  // get data whenever front-end refresh everytime
  socket.on("output-message", (data) => {
    ChatModel.find({ room: data.room }).then((history) => {
      socket.emit("output-message", history);
    });
  });

  //get the last message
  // ChatModel.find({ room: data.room }).then((history) => {
  //   socket.emit("latest-message", history);
  // });

  // random ID given to whoever log in to the application
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    ChatModel.find({ room: data.room }).then((history) => {
      //console.log(data.room);
      socket.emit("output-message", history);
    });
    socket.join(data.room);
    console.log(`User with ID: ${socket.id} joined the room: ` + data.room);
  });

  socket.on("send_message", (data) => {
    const chat = new ChatModel({
      message: data.message,
      author: data.author,
      room: data.room,
      time: data.time,
    });
    try {
      //save this info. into collection
      chat.save().then((data) => {
        socket.broadcast.emit("receive_message", data);
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

//---------MongoDB from here create users--------------//
//Sign up
app.post("/register", async (req, res) => {
  const password = req.body.passWord;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const user = new UserModel({
    userName: req.body.userName,
    passWord: hashPassword,
  });
  try {
    await user.save(); //save this info. into collection
    res.send("data inserted");
  } catch (err) {
    console.log(err);
  }
});
// send blank message
// app.post("/send", async (req, res) => {
//   const chat = new ChatModel({
//     message: req.body.message,
//     author: req.body.author,
//     room: "?",
//     time: "?",
//   });
//   try {
//     //save this info. into collection
//     await chat.save();
//   } catch (err) {
//     console.log(err);
//   }
// });
// Login
app.post("/login", async (req, res) => {
  try {
    const userName = req.body.userName;
    const passWord = req.body.passWord;
    UserModel.findOne({ userName: userName }).then((data) => {
      // console.log(data);
      if (data !== null) {
        bcrypt.compare(passWord, data.passWord, (error, response) => {
          if (response) {
            res.send("User Log In!");
            // console.log(response);
            console.log("User Log in!!");
          } else {
            console.log("password wrong!!!");
            res.send("Password Wrong!!");
          }
        });
      } else {
        res.send("User not exist!!");
      }
    });
  } catch (e) {
    console.log("login error", e);
  }
});

// friendslist that you chatted before
app.get("/friends", async (req, res) => {
  const username = req.query.username ?? "";

  try {
    const username = req.query.username ?? "";
    RoomModel.find({ userName: username }).then((data) => {
      // console.log(data);
      res.send(data);
    });
  } catch (e) {
    consoxle.log("finding error", e);
  }
});

//get the last message
app.get("/latest-message", (req, res) => {
  const room = req.query.room ?? "";
  console.log(room);
  ChatModel.aggregate([
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $group: {
        _id: "$room",
        message: {
          $first: "$message",
        },
      },
    },

    {
      $match: {
        _id: {
          $in: room,
        },
      },
    },
  ]).then((data) => {
    console.log(data);
    res.send(data);
  });
});

// new friends requests list
app.get("/newfriends", async (req, res) => {
  try {
    const friend = req.query.username ?? "";
    RequestModel.find({ friend: friend }).then((data) => {
      // console.log(data);
      res.send(data);
    });
  } catch (e) {
    console.log("finding error", e);
  }
});

// delete RoomModel one-sided frd-request
app.delete("/delete", async (req, res) => {
  try {
    const friend = req.query.username ?? "";
    RoomModel.remove({ friend: friend }).then((data) => {
      // console.log(data);
      res.send(data);
    });
  } catch (e) {
    console.log("finding error", e);
  }
});

// delete and deny new-friends requests
app.delete("/deleterequest", async (req, res) => {
  try {
    const friend = req.query.username ?? "";
    RequestModel.remove({ friend: friend }).then((data) => {
      // console.log(data);
      res.send(data);
    });
  } catch (e) {
    console.log("finding error", e);
  }
});

// all the users sign up for this chat-app excepts for friends you already have
app.get("/all-users", async (req, res) => {
  const userName = req.query.userName ?? "";
  try {
    RoomModel.find({ userName: userName }).then((data) => {
      //added is an array
      const added = data.map((item) => {
        return item.friend;
      });
      UserModel.find({ userName: { $nin: added, $ne: userName } }).then(
        (data) => {
          res.send(data);
        }
      );
      //console.log(added);
    });
  } catch (e) {
    console.log("error...", e);
  }
  // try {
  //   UserModel.find({ userName: { $ne: userName } }).then((data) => {
  //     res.send(data);
  //   });
  // } catch (e) {
  //   console.log("login error", e);
  // }
});

// first add friends request
app.post("/new-requests", async (req, res) => {
  const userName = req.body.userName;
  const friend = req.body.friend;
  const room = req.body.room;
  const request = new RequestModel({
    userName: userName,
    friend: friend,
    room: room,
  });
  try {
    const result = await request.save(); //save this info. into collection
    res.send(result);
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
});

// Add frieds
app.post("/add-friends", async (req, res) => {
  const userName = req.body.userName;
  const friend = req.body.friend;
  const room = req.body.room;
  const addfriend = new RoomModel({
    userName: userName,
    friend: friend,
    room: room,
  });
  try {
    const result = await addfriend.save(); //save this info. into collection
    res.send(result);
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
});

server.listen(process.env.PORT || 3001, () => {
  console.log("Server Running On 3001");
});
