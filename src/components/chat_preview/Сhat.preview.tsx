import { useEffect, useState } from "react";
import Menu from "../Menu";
import ApiManager from "../../ApiManager/ApiManager";
import ChatsPreview from "../../pages/Chats.preview";
import "../../components/chat_preview/Chat.preview.css";
import { useNavigate } from "react-router-dom";

export type ChatsInterface = {
  id: number;
  userInChat: UsersInChat[];
  unreadMessageCount: number;
};
export type UsersInChat = {
  id: number;
  firstName: string;
  lastName: string;
  userId: number;
};

const ChatPreview = (chatInfo: {
  chatId: number;
  usersInChat: UsersInChat[];
  unreadMessageCount: number;
}) => {
  const [chatId, setChatId] = useState<number>(chatInfo.chatId);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(
    chatInfo.unreadMessageCount
  );
  const [usersInChat, setUsersInChat] = useState<UsersInChat[]>(
    chatInfo.usersInChat
  );
  const [error, setError] = useState<string>("");

  const loggedInUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const navigateToChat = () => {
    navigate("/chats/" + chatId);
  };
  return (
    <div className="chat-container" onClick={navigateToChat}>
      <h2>Welcome to Chat ID: {chatId}</h2>
      <h3>Users in this Chat:</h3> <div>{chatInfo.unreadMessageCount}</div>
      {usersInChat.map((userInChat) => {
        // Проверяем, совпадает ли userId
        if (userInChat.userId === Number(loggedInUserId)) {
          return null; // Не вывожу имя и фамилию, если userId совпал
        }
        return (
          <div>
            {" "}
            <p key={userInChat.id}>
              {userInChat.firstName} {userInChat.lastName}
            </p>
          </div>
        );
      })}
      {error && <p>{error}</p>}
      {/* Поле ввода сообщения */}
    </div>
  );
};

export default ChatPreview;
