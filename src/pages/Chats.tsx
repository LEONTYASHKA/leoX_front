import { useEffect, useState } from "react";
import ApiManager from "../ApiManager/ApiManager";
import Chat from "../components/chat.tsx/Chat";
import Menu from "../components/Menu";
import { useParams } from "react-router-dom";

// Тип для чатов
export type ChatsInterface = {
  id: number;
  name: string;
};

const Chats = () => {
  const { id } = useParams();

  return (
    <div>
      <Menu />
      <h1>List of Chats</h1>

      <Chat key={id} chatId={id} />
    </div>
  );
};

export default Chats;
