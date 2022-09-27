import "./App.css";
import { useState, useContext } from "react";
import io from "socket.io-client";
import { CONNECTION_PORT } from "./helpers/constants";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import Homepage from "./Homepage";
import Friends from "./Friends";
import YourFriends from "./YourFriends";
import NewFriends from "./NewFriends";
import Mainpage from "./Mainpage";
import { ChatContext } from "./helpers/ChatContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Resize from "./helpers/Resize";

const socket = io.connect(CONNECTION_PORT);

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [allrequests, setAllRequests] = useState([]);
  const [person, setPerson] = useState("");
  const [chatState, setChatState] = useState("homepage");
  const [textNumbers, setTextNumbers] = useState({ author: "", number: 0 });

  return (
    <div>
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
            person,
            setPerson,
            chatState,
            setChatState,
            textNumbers,
            setTextNumbers,
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-friends" element={<Friends />} />
            <Route path="/newfriends" element={<NewFriends />} />
            <Route path="/yourfriends" element={<YourFriends />} />
            <Route path="/main-page" element={<Mainpage />} />
            <Route path="/resize" element={<Resize />} />
          </Routes>
        </ChatContext.Provider>
      </Router>
    </div>
  );
}

export default App;
