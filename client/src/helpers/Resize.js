import Split from "@uiw/react-split";
import Homepage from "../Homepage";
import Chat from "../Chat";

const Demo = () => (
  <Split
    style={{ height: "100vh", border: "1px solid #d5d5d5", borderRadius: 3 }}
  >
    <div style={{ flex: 1 }}>
      <Homepage />
    </div>
    <div>
      <Chat style={{ flex: 1 }} />
    </div>
  </Split>
);
export default Demo;
