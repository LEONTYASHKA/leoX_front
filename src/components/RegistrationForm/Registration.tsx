import { useState } from "react";
import ApiManager from "../../ApiManager/ApiManager";
import Button from "../Button";
import Input from "../Input";
import "./Registration.css";

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseFromServer, setresponseFromServer] = useState("");

  const handleSubmit = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };
    const res = await ApiManager.register(userData);
    const responseFromServer = await res.json();
    if (responseFromServer != 200) {
      setresponseFromServer(responseFromServer.message);

      return responseFromServer;
    }
  };

  return (
    <div className="registration-form">
      <h2>Please firll the registration form:</h2>
      <label className="registration-form">
        First Name:
        <Input
          placeHolder="First Name"
          type="text"
          onChange={(ev) => setFirstName(ev.target.value)}
        />
      </label>

      <label className="registration-form">
        Last Name:
        <Input
          placeHolder="Last Name"
          type="text"
          onChange={(ev) => setLastName(ev.target.value)}
        />
      </label>

      <label className="registration-form">
        Email:
        <Input
          placeHolder="Email"
          type="text"
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </label>

      <label className="registration-form">
        Password:
        <Input
          placeHolder="Password"
          type="password"
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </label>

      <label className="registration-form">
        Confirm Password:
        <Input
          placeHolder="Confirm Password"
          type="password"
          onChange={(ev) => setConfirmPassword(ev.target.value)}
        />
      </label>
      <span>{responseFromServer}</span>
      <Button onClick={handleSubmit} text="Register" />
    </div>
  );
};

export default RegistrationForm;
