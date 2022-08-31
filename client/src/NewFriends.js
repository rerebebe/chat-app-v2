import Axios from "axios";
import { useEffect, useState, useContext } from "react";
import { API_HOST } from "./helpers/constants";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "./helpers/ChatContext";

function NewFriends() {
  const navigate = useNavigate();
  const { allrequests, setAllRequests } = useContext(ChatContext);

  useEffect(() => {
    Axios.get(`${API_HOST}/newfriends`, {
      params: {
        username: sessionStorage.getItem("name"),
      },
    }).then((response) => {
      setAllRequests(response.data);
    });
  }, []);

  const addFriend = async (id) => {
    const singleUser = allrequests.filter((item) => item._id === id);
    console.log(singleUser);
    const response = await Axios.post(
      `${API_HOST}/add-friends`,

      {
        userName: sessionStorage.getItem("name"),
        friend: singleUser[0].userName,
        room: singleUser[0].room,
      }
    );
    const response2 = await Axios.delete(`${API_HOST}/deleterequest`, {
      params: {
        username: sessionStorage.getItem("name"),
      },
    });
    // const response3 = await Axios.post(`${API_HOST}/send`, {
    //   author: sessionStorage.getItem("name"),
    //   message: " ",
    // });

    setAllRequests(function (prev) {
      return prev.filter((item) => item._id !== id);
    });
    sessionStorage.setItem("room", singleUser[0].room);
    navigate("/");
    console.log(`key:${id}`);
    console.log(singleUser[0].room);
    console.log(response.data);
  };

  const deleteRequest = async (id) => {
    const singleUser = allrequests.filter((item) => item._id === id);
    const response = await Axios.delete(
      `${API_HOST}/delete`,

      {
        params: {
          username: sessionStorage.getItem("name"),
        },
      }
    );
    const response2 = await Axios.delete(
      `${API_HOST}/deleterequest`,

      {
        params: {
          username: sessionStorage.getItem("name"),
        },
      }
    );
    setAllRequests(function (prev) {
      return prev.filter((item) => item._id !== id);
    });
    console.log(`key:${id}`);
    console.log(singleUser[0].room);
    console.log(response.data);
  };

  return (
    <div className="RoomTab">
      <div className="header">
        <input placeholder="Search..." />
      </div>
      {allrequests.map((user, i) => {
        return (
          <div className="chatroom" key={user._id}>
            <div>
              Friend reqest from{" "}
              <span className="newfriendspan">{user.userName}</span> !
            </div>
            <div>
              <button
                className="chatroomButton"
                onClick={() => {
                  addFriend(user._id);
                }}
              >
                Yes
              </button>
              <button
                className="chatroomButton"
                onClick={() => {
                  deleteRequest(user._id);
                }}
              >
                No
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NewFriends;
