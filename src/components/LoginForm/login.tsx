import { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import "./login.css";
import { useAuth } from "../AuthProviderLocalStorge";

const LoginForm = () => {
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = async () => {
    loginAction({ email, password });
  };

  return (
    <div className="login-form">
      <h2>Login:</h2>
      <label>
        Email:
        <Input
          placeHolder="Email"
          type="string"
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </label>

      <label>
        Password:
        <Input
          placeHolder="Password"
          type="password"
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </label>
      <br />

      <Button onClick={HandleLogin} text="Login" />
      <span className="login-form-writeforlink">
        If you don't have an account Please{" "}
        <a href="/auth/registration">Sign Up</a>
      </span>
    </div>
  );
};

export default LoginForm;
