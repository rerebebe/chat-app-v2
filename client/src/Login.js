import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { API_HOST } from "./helpers/constants";

function Login() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const { setUserName, userName, password, setPassword } =
    useContext(ChatContext);

  const logIn = async (e) => {
    if (userName !== "" || password !== "") {
      setAlert("please enter username/password.");
    }
    e.preventDefault();
    const response = await Axios.post(
      `${API_HOST}/login`,

      {
        userName: userName,
        passWord: password,
      }
      // { withCredentials: true }
    );
    try {
      console.log(response);
      navigate("/homepage");
      setAlert(response.data);
      sessionStorage.setItem("name", userName);
    } catch {
      console.log("Wrong!!!");
      navigate("/login");
      setAlert(response.data);
    }
  };

  return (
    <div className="App">
      <div className="loginTab">
        {alert}
        <div className="login">
          <div>
            <label>User Name:</label>
            <input
              type="text"
              placeholder="userName..."
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="password..."
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
        </div>
        <button className="ButtonChat" onClick={logIn}>
          Log in
        </button>
        <div className="Linktext">
          <Link to="/register">
            <u>Need an account?</u>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
