import Homepage from "./Homepage";
import Chat from "./Chat";
import Friends from "./Friends";
import YourFriends from "./YourFriends";
import NewFriends from "./NewFriends";
import { useContext } from "react";
import { ChatContext } from "./helpers/ChatContext";
import Split from "@uiw/react-split";

function Mainpage() {
  // const navigate = useNavigate();
  const { chatState, setChatState } = useContext(ChatContext);
  return (
    // <div className="mainpage">
    <Split
      style={{
        height: "100vh",
        border: "1px solid #d5d5d5",
        borderRadius: 3,
      }}
    >
      <div style={{ minWidth: 400 }}>
        {chatState === "homepage" && <Homepage />}
        {chatState === "your-friend" && <YourFriends />}
        {chatState === "platform-users" && <Friends />}
        {chatState === "friend-request" && <NewFriends />}
      </div>
      <div style={{ flex: 1, minWidth: 450 }}>
        <Chat />
      </div>
    </Split>
  );
}

export default Mainpage;
