import { useEffect, useState } from "react";
import ApiManager from "../ApiManager/ApiManager";
import Menu from "../components/Menu";
import ChatPreview, {
  NewMethodGetChatInfo,
} from "../components/chat_preview/Сhat.preview";
import "../components/chat_preview/Chat.preview.css";

const ChatsPreview = () => {
  const [chats, setChats] = useState<NewMethodGetChatInfo[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const chatData = await ApiManager.getChatInfo();
        setChats(chatData);
      } catch (err) {
        setError("Error fetching chat data");
      }
    }

    fetchChats();
  }, []);

  return (
    <div>
      <Menu />
      <h1>List of Chats</h1>
      {error && <p>{error}</p>}
      {chats.length > 0 ? (
        chats.map((chat) => (
          <ChatPreview
            key={chat.id}
            chatId={chat.id}
            unreadMessageCount={chat.unreadMessageCount}
            lastMessage={chat.lastMessage}
            name={chat.name}
          />
        ))
      ) : (
        <p>Loading chats...</p>
      )}
    </div>
  );
};

export default ChatsPreview;
