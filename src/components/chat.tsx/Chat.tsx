import { useEffect, useState } from "react";
import ApiManager from "../../ApiManager/ApiManager";
import { useParams } from "react-router-dom";
import moment from "moment";
import "./chat.css";
import { io, Socket } from "socket.io-client";

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userId: number;
  email: string;
};

export type GetChatDto = {
  id: number;
  name: string;
  users?: UserDto[];
};

export type SenderDto = {
  firstName: string;
  lastName: string;
  isCurrentUserSent: boolean;
};

export type MessageDto = {
  id: number;
  text: string;
  createdAt: Date;
  sender: SenderDto;
  countPerPage: number;
  pageNumber: number;
};

const Chat = (chatInfo: { chatId: any }) => {
  const loggedInUserId = localStorage.getItem("userId");
  const [responseChatInformation, setResponseChatInformation] = useState(
    null as any
  );
  const [responseMessages, setMessageData] = useState<MessageDto[]>([]);
  const [error, setError] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [countPerPage, setCountPerPage] = useState<number>(5);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [lastMessageId, setLastMessageId] = useState<Number>();
  const [searchEmail, setSearchEmail] = useState<string>(""); // Поле для поиска по почте
  const [searchedUser, setSearchedUser] = useState<UserDto | null>(null); // Результат поиска пользователя
  const [isUsersListVisible, setIsUsersListVisible] = useState(false);
  const [usersInChat, setUserInChat] = useState<UserDto[]>([]);
  const [lastReadMessageId, setLastReadMessageId] = useState(null);

  ////
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const send = (value: string) => {
    socket?.emit("messages", value);
  };
  // Инициализация WebSocket
  useEffect(() => {
    const newSocket = io("http://localhost:8001", {
      query: {
        token: localStorage.getItem("token") || "",
        chatId: chatInfo.chatId,
      },
    });
    setSocket(newSocket);

    // Подписка на получение новых сообщений
    newSocket.on(
      "message",
      async (data: { chatId: number; messages: MessageDto[] }) => {
        // Обновляем список сообщений
        setMessageData(data.messages);

        // Устанавливаем последнее прочитанное сообщение
        if (data.messages.length > 0) {
          const lastMessage = data.messages[data.messages.length - 1];
          setLastMessageId(lastMessage.id);
          await ApiManager.setLastReadMessage(chatInfo.chatId, lastMessage.id);
        }
      }
    );

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [chatInfo.chatId]);

  // Функция для отображения/скрытия списка пользователей
  const toggleUsersList = () => {
    setIsUsersListVisible(!isUsersListVisible);
  };

  ///
  useEffect(() => {
    const fetchChatData = async () => {
      const responseChatInformation = await ApiManager.getChatInformation(
        chatInfo.chatId
      );
      setUserInChat(responseChatInformation.users);
      setResponseChatInformation(responseChatInformation);
    };
    console.log(responseChatInformation);
    fetchChatData();
  }, []);

  useEffect(() => {
    const fetchDataMessages = async () => {
      const updateMessages = await ApiManager.getMessages(
        chatInfo.chatId,
        countPerPage.toString(),
        pageNumber.toString()
      );

      if (updateMessages.length > 0) {
        setLastMessageId(updateMessages[updateMessages.length - 1].id);
        await ApiManager.setLastReadMessage(
          chatInfo.chatId,
          updateMessages[updateMessages.length - 1].id
        );
      }
      // new api manager call
      setMessageData(updateMessages);
    };
    fetchDataMessages();

    console.log(responseMessages);
  }, []);

  // useEffect(() => {
  //   //Implementing the setInterval method
  //   const interval = setInterval(async () => {
  //     const newMessage = await ApiManager.getNewMessages(
  //       chatInfo.chatId,
  //       lastMessageId?.toString()
  //     );
  //     const messageWithLastMessage = [...responseMessages, ...newMessage];
  //     setMessageData(messageWithLastMessage);
  //     if (newMessage.length > 0) {
  //       setLastMessageId(newMessage[newMessage.length - 1].id);
  //     }
  //   }, 5000);

  //   //Clearing the interval
  //   return () => clearInterval(interval);
  // }, [lastMessageId, responseMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket?.emit("chat.message", {
        chatId: chatInfo.chatId,
        message: newMessage,
      });
      setNewMessage(""); // Очищаем поле после отправки
    }
  };

  const handleShowMore = async () => {
    setPageNumber(pageNumber + 1);
    const resWithPagination = await ApiManager.getMessages(
      chatInfo.chatId,
      countPerPage.toString(),
      (pageNumber + 1).toString()
    );
    const newArr = [...resWithPagination, ...responseMessages];
    setMessageData(newArr);
    if (newArr.length > 0) {
      const lastMessage = newArr[newArr.length - 1];
      setLastMessageId(lastMessage.id);
    }
  };

  // Функция поиска пользователя по email
  const handleSearchUser = async () => {
    const result = await ApiManager.searchUserByEmail(searchEmail); // Функция поиска
    console.log(result);
    setSearchedUser(result); // Устанавливаем найденного пользователя
    setSearchError(result.message);
  };

  const handleAddUserToChat = async () => {
    if (searchedUser) {
      const resFromAddUser = await ApiManager.addUserToChat(
        chatInfo.chatId,
        searchedUser.id
      );
      setError(resFromAddUser.message);
      alert(`User ${searchedUser.firstName} added to the chat`);
      console.log(resFromAddUser);

      console.log([resFromAddUser.newUser]);

      setUserInChat([...usersInChat, resFromAddUser.newUser]);
      console.log(resFromAddUser);
    }
  };

  if (!responseChatInformation) {
    return <div>Загрузка...</div>;
  }

  if (isLoading) {
    return <div>isLoading </div>;
  } else {
    return (
      <div className="chat-container-main">
        <div className="search-user-container">
          <p>
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search user by email"
            />
            <button onClick={handleSearchUser}> Search</button>{" "}
            <button onClick={handleShowMore}>Show more</button>
          </p>
          {searchedUser && (
            <div>
              <p>
                <div className="found-user">
                  {searchError}
                  {searchedUser.email} {searchedUser.firstName}{" "}
                  {searchedUser.lastName}{" "}
                  <button onClick={handleAddUserToChat}>Add to chat</button>
                </div>{" "}
              </p>
            </div>
          )}
        </div>{" "}
        <div className="name-chats" onClick={toggleUsersList}>
          <span>
            Welcome to Chat: {responseChatInformation.name} {}
          </span>
        </div>
        {/* Отображение списка пользователей только при открытии */}
        {isUsersListVisible && (
          <div className="heder-with-users">
            {usersInChat.map((sender: UserDto) => {
              if (sender.userId === Number(loggedInUserId)) {
                return null;
              }
              return (
                <div key={sender.id}>
                  <p>
                    {sender.firstName} {sender.lastName}:
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <div className="place-for-msg">
          <div className="chat-container-msg">
            {responseMessages.map((item) => {
              return (
                <div
                  key={item.id}
                  className={
                    item.sender.isCurrentUserSent
                      ? "messageFromCurrentUser"
                      : "message"
                  }
                >
                  {item.sender.isCurrentUserSent ? (
                    <span>You: </span>
                  ) : (
                    item.sender.firstName + " " + item.sender.lastName + ": "
                  )}
                  {item.text}{" "}
                  <span className="date">
                    {moment(item.createdAt).format("HH:mm")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="send-message-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
        {error && <p>{error}</p>}
      </div>
    );
  }
};
export default Chat;
