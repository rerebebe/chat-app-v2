import Axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "./helpers/ChatContext";
import { API_HOST } from "./helpers/constants";
import { useNavigate } from "react-router-dom";
import { Input, Grid, Button, Spacer } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { UserIcon } from "./components/UserIcon";

function Register() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const { setUserName, userName, password, setPassword } =
    useContext(ChatContext);
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async (e) => {
    e.preventDefault();

    const response = await Axios.post(`${API_HOST}/register`, {
      userName: userName,
      passWord: password,
    });
    try {
      if (password !== confirmPassword) {
        setAlert("passwords do not match!!");
        navigate("/register");
      } else {
        console.log(response);
        navigate("/");
        sessionStorage.setItem("name", userName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={signUp}>
        <div className="signinLoginTab">
          <button
            onClick={() => {
              navigate("/");
            }}
            style={{ backgroundColor: "lightgrey" }}
          >
            Log In
          </button>
          <button
            onClick={() => {
              navigate("/register");
            }}
            style={{ color: "blue" }}
          >
            Sign Up
          </button>
        </div>
        <div className="loginTab">
          <h1 style={{ color: "darkslategrey" }}>Get an account</h1>
          {alert}

          <div className="loginContent">
            <Grid>
              <Input
                rounded
                bordered
                placeholder="UserName"
                label="UserName"
                status="default"
                size="md"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Grid>
            <Grid>
              <Input.Password
                rounded
                bordered
                placeholder="Password"
                label="Password"
                status="default"
                size="md"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid>
              <Input.Password
                rounded
                bordered
                placeholder="Confirm Password"
                label="Confirm Password"
                status="default"
                size="md"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Grid>
          </div>
          <Spacer />
          <Button
            icon={<UserIcon />}
            size="lg"
            color="primary"
            flat
            type="submit"
          >
            Sign Up
          </Button>
          <Spacer />
        </div>
      </form>
    </div>
  );
}

export default Register;
