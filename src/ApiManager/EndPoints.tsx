const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/registration",
  PROFILE: "/profile",
  USERS: "/users/find",
  CHATS: "/chats/",
  CHAT_INFORMATION: "/chats/:id",
  CHAT_MESSAGES: "/chats/:id/messages",
  CHAT_NEWMESSAGES: "/chats/:id/new-messages",
  SEND_MESSAGE: "/chats/:id/messages",
  SEARCH_USERS: "/users/search",
  ADD_USER_TO_CHAT: "/chats/:chatId/add-user",
  SET_LAST_READ_MESSAGE: "/chats/:chatId/set-last-read-message",
  UNREAD_MESSAGE: "/chats/:chatId/unread-messages",
  DELETE_MESSAGE: "/messages/:chatId/message/:messageId",
  DELETE_USER_FROM_CHAT: "/chats/:chatId/chat/:userId",

  // GETCHAT: "/chat/",
};
export default ENDPOINTS;
