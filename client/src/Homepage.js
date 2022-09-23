import Axios from "axios";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { API_HOST } from "./helpers/constants";
import { FaUserFriends } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";

function Homepage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [roomarray, setRoomArray] = useState([]);
  const {
    socket,
    allrequests,
    setAllRequests,
    person,
    setPerson,
    chatState,
    setChatState,
  } = useContext(ChatContext);

  // const connectToRoom = (id) => {
  //   const room = friends.filter((item) => item._id === id);
  //   console.log(room[0].room);
  //   socket.emit("join_room", { room: room[0].room });
  //   navigate("/chat");
  //   sessionStorage.setItem("room", room[0].room);
  // };
  const connectToRoomMsg = (id) => {
    const room = lastMessages.filter((item) => item._id === id);
    console.log(room[0].ROOM.friend);
    socket.emit("join_room", { room: room[0]._id });
    navigate("/main-page");
    sessionStorage.setItem("room", room[0]._id);
    setPerson(room[0].ROOM.friend);
  };

  useEffect(() => {
    Axios.get(`${API_HOST}/friends`, {
      params: { username: sessionStorage.getItem("name") },
    }).then((response, err) => {
      try {
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
          console.log(
            response.data.filter((item) => {
              return item.ROOM.userName === sessionStorage.getItem("name");
            })
          );
          setLastMessages(
            response.data.filter((item) => {
              return item.ROOM.userName === sessionStorage.getItem("name");
            })
          );

          // setLastMessages(
          //   response.data.map((item) => {
          //     return item.message;
          //   })
          // );
        });
      } catch {
        console.log(err);
      }
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
    <div className="RoomTab">
      <div>
        <h1 className="header">Chat</h1>

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
              // navigate("/add-friends");
              setChatState("platform-users");
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
              // navigate("/newfriends");
              setChatState("friend-request");
            }}
          >
            <FaUserFriends />
            <span className="newfriendnumber">
              {allrequests.length !== 0 ? allrequests.length : null}
            </span>
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
              Friends
            </Tooltip>
          }
        >
          <Button
            className="yourFriend"
            variant="secondary"
            onClick={() => {
              setChatState("your-friend");
            }}
          >
            <BsHeartFill />
          </Button>
        </OverlayTrigger>
      </div>
      <div>
        {/* <div>
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
          </div> */}
        <div className="msg">
          {lastMessages.map((msg) => {
            return (
              <button
                key={msg._id}
                onClick={() => {
                  connectToRoomMsg(msg._id);
                }}
                className="chatroomHomepage"
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span>{msg.ROOM.friend}</span>
                  {"   "}
                  <span>{msg.message}</span>
                </div>
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
  );
}

export default Homepage;
