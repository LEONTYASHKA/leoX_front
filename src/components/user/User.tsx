import { Menu } from "@chakra-ui/react";
import "./user.css";
import Button from "../Button";
import ApiManager from "../../ApiManager/ApiManager";
import { useState } from "react";

const User = (user: { id: number; fristName: string; lastName: string }) => {
  const [error, setError] = useState("");
  const initiateChat = async (id: number) => {
    const response = await ApiManager.createChat({
      userIdToChat: id,
    });

    if (response.message != 200) {
      setError(response.message);
    }
  };
  return (
    <div className="user">
      <p>First name: {user.fristName}</p>
      <p>Last name:{user.lastName} </p>
      <p>
        <span className="error-message">{error}</span>
      </p>
      <Button
        onClick={async () => {
          initiateChat(user.id);
        }}
        text={"Start chat " + user.id}
      ></Button>
    </div>
  );
};
export default User;
