import { useEffect, useState } from "react";
import ApiManager from "../ApiManager/ApiManager";
import Menu from "../components/Menu";
import ChatPreview, {
  ChatsInterface,
} from "../components/chat_preview/Сhat.preview";
import "../components/chat_preview/Chat.preview.css";

const ChatsPreview = () => {
  const [chats, setChats] = useState<ChatsInterface[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const chatData = await ApiManager.getChatInfo(); // Получение списка чатов через API
        setChats(chatData);
      } catch (err) {
        setError("Error fetching chat data");
      }
    }

    fetchChats();
  }, []); //

  return (
    <div>
      <Menu></Menu>
      <h1>List of Chats</h1>
      {chats.map((chat) => (
        <ChatPreview
          chatId={chat.id}
          unreadMessageCount={chat.unreadMessageCount}
          usersInChat={chat.userInChat}
        ></ChatPreview>
      ))}
    </div>
  );
};

export default ChatsPreview;
