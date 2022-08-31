import Axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { API_HOST } from "./helpers/constants";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const { setUserName, userName, password, setPassword } =
    useContext(ChatContext);
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert("passwords do not match!!");
    }
    const response = await Axios.post(`${API_HOST}/register`, {
      userName: userName,
      passWord: password,
    });
    try {
      console.log(response);
      navigate("/");
      sessionStorage.setItem("name", userName);
    } catch (error) {
      console.log(error);
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
              type="text"
              placeholder="password..."
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="text"
              placeholder="password..."
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </div>
        </div>
        <button onClick={signUp} className="ButtonChat">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Register;
