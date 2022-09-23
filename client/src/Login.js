import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { API_HOST } from "./helpers/constants";
import { Input, Grid, Button, Spacer } from "@nextui-org/react";
import { UserIcon } from "./components/UserIcon";

function Login() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const { setUserName, userName, password, setPassword } =
    useContext(ChatContext);

  const logIn = async (e) => {
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
      if (response.data === "User not exist!!") {
        navigate("/");
        setAlert(response.data);
      } else if (response.data === "Password Wrong!!") {
        navigate("/");
        setAlert(response.data);
      } else {
        console.log(response);
        navigate("/main-page");
        setAlert(response.data);
        sessionStorage.setItem("name", userName);
      }
    } catch {
      console.log("Wrong!!!");
      navigate("/");
      setAlert(response.data);
    }
  };

  return (
    <div className="App">
      <form onSubmit={logIn}>
        <div className="signinLoginTab">
          <button
            onClick={() => {
              navigate("/");
            }}
            style={{ color: "blue" }}
          >
            Log In
          </button>
          <button
            onClick={() => {
              navigate("/register");
            }}
            style={{ backgroundColor: "lightgrey" }}
          >
            Sign Up
          </button>
        </div>
        <div className="loginTab">
          <h1 style={{ color: "darkslategrey" }}>Log In on Chatty-App</h1>
          {alert}
          <div className="loginContent">
            <Grid>
              <Input
                rounded
                bordered
                label="UserName"
                placeholder="UserName"
                size="md"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                required
              />
            </Grid>

            <Grid>
              <Input.Password
                rounded
                bordered
                placeholder="Password"
                label="Password"
                size="md"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </Grid>
          </div>
          {/* <button className="ButtonChat" onClick={logIn}>
          Log in
        </button>
         */}
          <Spacer y={1} />
          <Button
            icon={<UserIcon />}
            size="lg"
            color="primary"
            flat
            type="submit"
          >
            Log In
          </Button>
          <Spacer y={0.5} />
          {/* <div className="Linktext">
            <Link to="/register">
              <u>Need an account?</u>
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  );
}

export default Login;
