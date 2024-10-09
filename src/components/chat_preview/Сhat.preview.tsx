import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/chat_preview/Chat.preview.css";
import moment from "moment";

export type NewMethodGetChatInfo = {
  id: number;
  name: string;
  lastMessage: LastMessageDto;
  unreadMessageCount: number;
};

export type LastMessageDto = {
  text: string;
  createdAt: Date;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

const ChatPreview = (chatInfo: {
  chatId: number;
  name: string;
  lastMessage: LastMessageDto;
  unreadMessageCount: number;
}) => {
  const [chatId, setChatId] = useState<number>(chatInfo.chatId);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(
    chatInfo.unreadMessageCount
  );
  const [lastMessage, setLastMessage] = useState<LastMessageDto>(
    chatInfo.lastMessage
  );
  const [chatName, setChatName] = useState<string>(chatInfo.name);
  console.log(chatName);
  const [lastSender, setLastSender] = useState<string>();
  const [error, setError] = useState<string>("");

  const loggedInUserId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    if (chatInfo.lastMessage.sender.id !== loggedInUserId) {
      setLastSender(
        `${chatInfo.lastMessage.sender.firstName} ${chatInfo.lastMessage.sender.lastName}`
      );
    } else {
      setLastSender("You");
    }
  }, [chatInfo, loggedInUserId]);

  const navigateToChat = () => {
    navigate("/chats/" + chatId);
  };

  return (
    <div className="general-div">
      <ul className="chat-users-list">
        <li className="chat-user-item" onClick={navigateToChat}>
          {lastMessage ? (
            <div>
              <div className="avatar-circle">
                {chatName.split(" ").length > 1
                  ? chatName.split(" ")[0][0] + " " + chatName.split(" ")[1][0]
                  : chatName.split(" ")[0][0]}
              </div>
              {lastMessage.sender ? (
                <p>
                  <h4 className="chat-user-name"> {chatName}</h4>{" "}
                  <span>{lastSender}: </span>
                  <span className="lastmessages">{lastMessage.text}</span>
                </p>
              ) : (
                <p>
                  <strong>Sender:</strong> Unknown
                </p>
              )}
              <span className="data-lastmessage">
                {moment(lastMessage.createdAt).format("HH:mm")}
              </span>
              <span>
                {unreadMessageCount > 0 && (
                  <div className="uread-messages">{unreadMessageCount}</div>
                )}
              </span>
            </div>
          ) : (
            <p>No messages yet</p>
          )}

          {error && <p>{error}</p>}
        </li>
      </ul>
    </div>
  );
};

export default ChatPreview;
