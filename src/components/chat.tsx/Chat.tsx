import { useEffect, useState } from "react";
import ApiManager from "../../ApiManager/ApiManager";
import { useParams } from "react-router-dom";
import moment from "moment";
import "./chat.css";
import { io, Socket } from "socket.io-client";
import ContextMenu from "../ContextMenu/ContextMenu";

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
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>();
  const [chatMame, setChatMame] = useState<string>("");
  ////
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const send = (value: string) => {
    socket?.emit("messages", value);
  };
  // initial WebSocket
  useEffect(() => {
    const newSocket = io("http://localhost:8001", {
      query: {
        token: localStorage.getItem("token") || "",
        chatId: chatInfo.chatId,
      },
    });
    setSocket(newSocket);

    // subscribe for get new messag
    newSocket.on(
      "message",
      async (data: { chatId: number; messages: MessageDto[] }) => {
        // update list message
        setMessageData(data.messages);

        // setup last read message
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
      setChatMame(responseChatInformation.name);
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
      setNewMessage("");
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSendMessage();
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

  const handleSearchUser = async () => {
    const result = await ApiManager.searchUserByEmail(searchEmail);
    console.log(result);
    setSearchedUser(result);
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
      setChatMame(resFromAddUser.name);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, messageId: number) => {
    event.preventDefault();
    setSelectedMessageId(messageId);
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setMenuVisible(true);
  };

  const handleSelectMessage = () => {
    alert(`message with ID ${selectedMessageId} selected`);
    setMenuVisible(false);
  };

  const handleDeleteMessage = async () => {
    setMessageData((prevMessages) =>
      prevMessages.filter((message) => message.id !== selectedMessageId)
    );

    await ApiManager.deleteMessage(chatInfo.chatId, selectedMessageId);
    setMenuVisible(false);
  };
  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };
  const deleteUserFromChat = async (idUserToDelete: number) => {
    await ApiManager.deleteUserFromChat(chatInfo.chatId, idUserToDelete);
    setUserInChat((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUserId)
    );
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
            Welcome to Chat: {chatMame} {}
          </span>
        </div>
        {isUsersListVisible && (
          <div className="heder-with-users">
            {usersInChat.map((sender: UserDto) => {
              if (sender.userId === Number(loggedInUserId)) {
                return null;
              }
              return (
                <ul key={sender.id}>
                  <li>
                    <div className="avatar-circle-msg">
                      {sender?.firstName[0]}
                      {sender?.lastName[0]}
                    </div>
                    {sender.firstName} {sender.lastName}
                    <div
                      className="delete-button"
                      onClick={() => deleteUserFromChat(sender.id)}
                    >
                      {" "}
                      Delete{" "}
                    </div>
                  </li>
                </ul>
              );
            })}
          </div>
        )}
        <div className="place-for-msg">
          <div className="chat-container-msg">
            {responseMessages.map((item) => (
              <div
                key={item.id}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                className={
                  item.sender.isCurrentUserSent
                    ? "messageFromCurrentUser"
                    : "message"
                }
              >
                {item.sender.isCurrentUserSent ? (
                  <h3 className="messege-sender-name">You</h3>
                ) : (
                  <span>
                    {" "}
                    <div className="avatar-circle-msg">
                      {item.sender.firstName[0]}
                      {item.sender.lastName[0]}
                    </div>
                    <h3 className="messege-sender-name">
                      {item.sender.firstName} {item.sender.lastName}
                    </h3>
                  </span>
                )}
                {item.text}
                <span className="date">
                  {moment(item.createdAt).format("HH:mm")}
                </span>
              </div>
            ))}
          </div>

          {menuVisible && (
            <div
              style={{
                position: "absolute",
                top: menuPosition.y,
                left: menuPosition.x - 10,
              }}
            >
              <ContextMenu
                onSelect={handleSelectMessage}
                onDelete={handleDeleteMessage}
              />
            </div>
          )}
        </div>
        <div className="send-message-container" onKeyDown={handleKeyDown}>
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
