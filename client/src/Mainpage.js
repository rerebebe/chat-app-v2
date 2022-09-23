import Homepage from "./Homepage";
import Chat from "./Chat";
import Friends from "./Friends";
import YourFriends from "./YourFriends";
import NewFriends from "./NewFriends";
import { useContext } from "react";
import { ChatContext } from "./helpers/ChatContext";

function Mainpage() {
  // const navigate = useNavigate();
  const { chatState, setChatState } = useContext(ChatContext);
  return (
    <div className="mainpage">
      <div>
        {chatState === "homepage" && <Homepage />}
        {chatState === "your-friend" && <YourFriends />}
        {chatState === "platform-users" && <Friends />}
        {chatState === "friend-request" && <NewFriends />}
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
}

export default Mainpage;
