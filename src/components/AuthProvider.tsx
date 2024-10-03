import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null as any);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState("null");

  const login = (userToken: string) => {
    console.log(123);

    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const isAuthenticated = !!token;
  console.log("Проверка", isAuthenticated);
  const logout = () => {
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context?.isAuthenticated) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
