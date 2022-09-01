import "./App.css";
import { useState, useContext } from "react";
import io from "socket.io-client";
import { CONNECTION_PORT } from "./helpers/constants";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import Homepage from "./Homepage";
import Friends from "./Friends";
import NewFriends from "./NewFriends";
import { ChatContext } from "./helpers/ChatContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const socket = io.connect(CONNECTION_PORT);

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [allrequests, setAllRequests] = useState([]);

  return (
    <div className="App">
      <Router>
        <ChatContext.Provider
          value={{
            socket,
            userName,
            setUserName,
            room,
            setRoom,
            password,
            setPassword,
            allrequests,
            setAllRequests,
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-friends" element={<Friends />} />
            <Route path="/newfriends" element={<NewFriends />} />
          </Routes>
        </ChatContext.Provider>
      </Router>
    </div>
  );
}

export default App;
