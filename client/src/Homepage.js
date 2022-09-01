import Axios from "axios";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { API_HOST } from "./helpers/constants";
import { FaUserFriends } from "react-icons/fa";

function Homepage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [roomarray, setRoomArray] = useState([]);
  const { socket, allrequests, setAllRequests } = useContext(ChatContext);

  const connectToRoom = (id) => {
    const room = friends.filter((item) => item._id === id);
    console.log(room[0].room);
    socket.emit("join_room", { room: room[0].room });
    navigate("/chat");
    sessionStorage.setItem("room", room[0].room);
  };
  const connectToRoomMsg = (id) => {
    const room = lastMessages.filter((item) => item._id === id);
    console.log(room[0]._id);
    socket.emit("join_room", { room: room[0]._id });
    navigate("/chat");
    sessionStorage.setItem("room", room[0]._id);
  };

  useEffect(() => {
    Axios.get(`${API_HOST}/friends`, {
      params: { username: sessionStorage.getItem("name") },
    }).then((response) => {
      setFriends(response.data);
      setRoomArray(response.data);
      console.log(response.data);
      const Rooms = roomarray.map((item) => {
        return item.room;
      });
      Axios.get(`${API_HOST}/latest-message`, {
        params: {
          room: response.data.map((item) => {
            return item.room;
          }),
        },
      }).then((response) => {
        console.log(response.data);
        setLastMessages(response.data);
        // setLastMessages(
        //   response.data.map((item) => {
        //     return item.message;
        //   })
        // );
      });
    });
    Axios.get(`${API_HOST}/newfriends`, {
      params: {
        username: sessionStorage.getItem("name"),
      },
    }).then((response) => {
      setAllRequests(response.data);
    });
  }, []);

  return (
    <div className="App">
      <div className="RoomTab">
        <div className="header">
          <h1>Chat</h1>
        </div>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip
              style={{
                position: "absolute",
                backgroundColor: "pink",
                padding: "2px 10px",
                color: "white",
                borderRadius: 3,
                border: 2,
              }}
            >
              add Friend
            </Tooltip>
          }
        >
          <Button
            className="addFriend"
            variant="secondary"
            onClick={() => {
              navigate("/add-friends");
            }}
          >
            +
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip
              style={{
                position: "absolute",
                backgroundColor: "pink",
                padding: "2px 10px",
                color: "white",
                borderRadius: 3,
                border: 2,
              }}
            >
              New Friends
            </Tooltip>
          }
        >
          <Button
            className="newFriend"
            variant="secondary"
            onClick={() => {
              navigate("/newfriends");
            }}
          >
            <FaUserFriends />
            <span className="newfriendnumber">
              {allrequests.length !== 0 ? allrequests.length : null}
            </span>
          </Button>
        </OverlayTrigger>
        <div className="Chatlayout">
          <div>
            {friends
              ? friends.map((person, i) => {
                  return (
                    <div key={person._id}>
                      <button
                        onClick={() => {
                          connectToRoom(person._id);
                        }}
                        className="chatroomHomepage"
                      >
                        <div> {person.friend}</div>
                      </button>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="msg">
            {lastMessages.reverse().map((msg) => {
              return (
                <button
                  onClick={() => {
                    connectToRoomMsg(msg._id);
                  }}
                >
                  {msg.message}
                </button>
              );
            })}
          </div>
        </div>

        {/* <div>
          <input
            type="text"
            placeholder="Name..."
            onChange={(e) => setUserName(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Room..."
            onChange={(e) => setRoom(e.target.value)}
          ></input>
        </div>

        <button className="ButtonChat" onClick={connectToRoom}>
          Enter Chat
        </button> */}
      </div>
    </div>
  );
}

export default Homepage;
