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

function YourFriends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [roomarray, setRoomArray] = useState([]);
  const { socket, allrequests, setAllRequests } = useContext(ChatContext);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const connectToRoom = (id) => {
    const room = friends.filter((item) => item._id === id);
    console.log(room[0].room);
    socket.emit("join_room", { room: room[0].room });
    navigate("/chat");
    sessionStorage.setItem("room", room[0].room);
  };
  const handleFilter = (e) => {
    const searchWord = e.target.value;
    const newFilter = friends.filter((user) => {
      return user.userName.toLowerCase().includes(searchWord);
    });
    setFilteredUsers(newFilter);
  };

  useEffect(() => {
    Axios.get(`${API_HOST}/friends`, {
      params: { username: sessionStorage.getItem("name") },
    }).then((response, err) => {
      try {
        setFriends(response.data);
        setRoomArray(response.data);
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
    <div className="App">
      <div className="RoomTab">
        <div className="header">
          <input placeholder="Search..." type="text" onChange={handleFilter} />
        </div>
        {/* <div className="header">
          <h1>Chat</h1>
        </div> */}
        {/* <OverlayTrigger
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
              navigate("/yourfriends");
            }}
          >
            <BsHeartFill />
          </Button>
        </OverlayTrigger> */}
        <div className="Chatlayout">
          <div className="msg">
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
        </div>
      </div>
    </div>
  );
}

export default YourFriends;
