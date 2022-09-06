import { useState, useContext, useEffect } from "react";
import { ChatContext } from "./helpers/ChatContext";
import ScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { API_HOST } from "./helpers/constants";

function Chat() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const [currentMessageNumber, setCurrentMessageNumber] = useState(10);
  const [typing, setTyping] = useState("");
  const [person, setPerson] = useState("");
  const { socket, userName, room } = useContext(ChatContext);
  // const increment = () => {
  //   setCurrentMessageNumber(currentMessageNumber + 1);
  // };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: sessionStorage.getItem("room"),
        author: sessionStorage.getItem("name"),
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", {
        room: sessionStorage.getItem("room"),
        author: sessionStorage.getItem("name"),
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      });

      setMessageList((list) => {
        return [...list, messageData];
      });
      setCurrentMessage("");

      // increment();
    }
  };
  // chatroom friend
  // client side will get the chat history from the MongoDB
  useEffect(() => {
    socket.emit("output-message", { room: sessionStorage.getItem("room") });
    socket.on("output-message", (history) => {
      // console.log(history.map((chat) => chat.chatName));
      //console.log(history);
      setMessageList(history);
    });
    Axios.get(`${API_HOST}/chatroomfriend`, {
      params: {
        username: sessionStorage.getItem("name"),
        room: sessionStorage.getItem("room"),
      },
    }).then((response) => {
      //console.log(response.data[0].friend);
      setPerson(response.data[0].friend);
    });
  }, []);
  // when you send message, the other client will receive message right away
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      {/* {currentMessageNumber} */}
      <div className="chat-header">
        <p>
          {person}
          {""}
          {typing}
        </p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={
                  sessionStorage.getItem("name") === messageContent.author
                    ? "other"
                    : "you"
                }
              >
                <div className="message-content">
                  <div className="messageitself">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <button
        className="EndChat"
        onClick={() => {
          navigate("/homepage");
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export default Chat;
