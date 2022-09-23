import Axios from "axios";
import { useEffect, useState, useContext } from "react";
import { API_HOST } from "./helpers/constants";
import { v4 } from "uuid";
import { ChatContext } from "./helpers/ChatContext";
import { useNavigate } from "react-router-dom";

function Friends() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { socket, setChatState } = useContext(ChatContext);
  const navigate = useNavigate();
  useEffect(() => {
    Axios.get(`${API_HOST}/all-users`, {
      params: {
        userName: sessionStorage.getItem("name"),
      },
    }).then((response) => {
      setAllUsers(response.data);
      console.log(response.data);
    });
  }, []);

  const addFriend = async (id) => {
    const singleUser = allUsers.filter((item) => item._id === id);
    Axios.post(`${API_HOST}/add-friends`, {
      userName: sessionStorage.getItem("name"),
      friend: singleUser[0].userName,
      room: v4(),
    }).then((response) => {
      const Room = response.data.room;
      Axios.post(`${API_HOST}/new-requests`, {
        userName: sessionStorage.getItem("name"),
        friend: singleUser[0].userName,
        room: Room,
      }).then((response) => {
        //console.log(response.data.room);
        socket.emit("join_room", { room: response.data.room });
        sessionStorage.setItem("room", response.data.room);
        navigate("/chat");
      });
    });

    setAllUsers(function (prev) {
      return prev.filter((item) => item._id !== id);
    });
    // console.log(`key:${id}`);
    console.log(singleUser[0].userName);
  };

  const handleFilter = (e) => {
    const searchWord = e.target.value;
    const newFilter = allUsers.filter((user) => {
      return user.userName.toLowerCase().includes(searchWord);
    });
    setFilteredUsers(newFilter);
  };

  return (
    <div className="RoomTab">
      <div className="header">
        <input placeholder="Search..." type="text" onChange={handleFilter} />
        <button
          onClick={() => {
            setChatState("homepage");
          }}
        >
          Back
        </button>
      </div>
      <div>
        {filteredUsers.length !== 0
          ? filteredUsers.map((user, i) => {
              return (
                <div className="chatroom" key={user._id}>
                  {user.userName}
                  <button
                    className="chatroomButton"
                    onClick={() => {
                      addFriend(user._id);
                    }}
                  >
                    +
                  </button>
                </div>
              );
            })
          : allUsers.map((user, i) => {
              return (
                <div className="chatroom" key={user._id}>
                  {user.userName}
                  <button
                    className="chatroomButton"
                    onClick={() => {
                      addFriend(user._id);
                    }}
                  >
                    +
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Friends;
