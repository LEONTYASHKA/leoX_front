import ENDPOINTS from "./EndPoints";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export default class ApiManager {
  static login = async (email: string, password: string, userId: number) => {
    const url = BASE_URL + ENDPOINTS.LOGIN;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  static register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const url = BASE_URL + ENDPOINTS.REGISTER;

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  };

  static getUserInfo = async () => {
    const url = BASE_URL + ENDPOINTS.PROFILE;

    const response = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token") ?? "",
      },
    });

    return (await response).json();
  };

  static profile = async (updateDate: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    const url = BASE_URL + ENDPOINTS.PROFILE;

    const response = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token") ?? "",
      },
      body: JSON.stringify(updateDate),
    });
    return (await response).json();
  };

  static getUsers = async () => {
    const url = BASE_URL + ENDPOINTS.USERS;

    const response = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token") ?? "",
      },
    });
    return (await response).json();
  };

  static createChat = async (dataToCreateChat: { userIdToChat: number }) => {
    const url = BASE_URL + ENDPOINTS.CHATS;

    const response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token") ?? "",
      },
      body: JSON.stringify(dataToCreateChat),
    });
    return (await response).json();
  };

  static getChatInfo = async () => {
    const url = BASE_URL + ENDPOINTS.CHATS;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });

    const chatData = await response.json();
    return chatData;
  };

  static getChatInformation = async (
    chatId: number
  ): Promise<{
    id: number;
    name: string;
    users: [];
  }> => {
    const url =
      BASE_URL + ENDPOINTS.CHAT_INFORMATION.replace(":id", String(chatId));
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });

    const responseChatInformation = await response.json();
    return responseChatInformation;
  };

  static getMessages = async (
    chatId: number,
    countPerPage: string,
    pageNumber: string
  ) => {
    const params: { [key: string]: string } = {
      pageNumber: pageNumber,
      countPerPage: countPerPage,
    };
    const url =
      BASE_URL +
      ENDPOINTS.CHAT_MESSAGES.replace(":id", String(chatId)) +
      "?" +
      new URLSearchParams(params).toString();
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });

    const messageData = await response.json();
    return messageData;
    console.log(messageData);
  };

  static sendMessage = async (
    chatId: number,
    messageData: { userId: string | null; text: string }
  ) => {
    const url =
      BASE_URL + ENDPOINTS.CHAT_MESSAGES.replace(":id", String(chatId));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
      body: JSON.stringify({
        userId: messageData.userId,
        text: messageData.text,
      }),
    });

    return await response.json();
  };

  static getNewMessages = async (chatId: number, lastMessageId?: string) => {
    const params: { [key: string]: string } = {};
    if (lastMessageId) {
      params.lastMessageId = lastMessageId;
    }
    console.log("PARAMS");

    console.log(params);

    const url =
      BASE_URL +
      ENDPOINTS.CHAT_NEWMESSAGES.replace(":id", String(chatId)) +
      "?" +
      new URLSearchParams(params).toString();
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });
    const newMessageData = await response.json();
    return newMessageData;
    console.log(newMessageData);
  };

  static searchUserByEmail = async (searchEmail: string) => {
    const url = BASE_URL + ENDPOINTS.SEARCH_USERS + `?email=${searchEmail}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });
    if (!response.ok) {
      throw new Error("erorr with finde user");
    }
    const data = await response.json();
    console.log(data);
    return data;
  };

  static addUserToChat = async (chatId: number, userId: number) => {
    const url =
      BASE_URL + ENDPOINTS.ADD_USER_TO_CHAT.replace(":chatId", String(chatId));

    const response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
      body: JSON.stringify({ userId }),
    });

    return (await response).json();
  };

  static setLastReadMessage = async (
    chatId: number,
    lastReadMessageId: number
  ) => {
    const url =
      BASE_URL +
      ENDPOINTS.SET_LAST_READ_MESSAGE.replace(":chatId", String(chatId));
    const response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
      body: JSON.stringify({ lastReadMessageId }),
    });
  };

  static countUnreadMessages = async (chatId: number, userId: number) => {
    const url =
      BASE_URL + ENDPOINTS.UNREAD_MESSAGE.replace(":chatId", String(chatId));
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") ?? ""),
      },
    });
    const lastMessage = await response.json();
    console.log(lastMessage);
    return lastMessage;
  };
}
