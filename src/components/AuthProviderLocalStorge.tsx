import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiManager from "../ApiManager/ApiManager";

const AuthContext = createContext(null as any);

const AuthProviderLocalStorge = ({ children }: any) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const navigate = useNavigate();

  const loginAction = async (data: {
    email: string;
    password: string;
    userId: number;
  }) => {
    const res = await ApiManager.login(data.email, data.password, data.userId);
    const responseFromServer = await res.json();
    console.log(data.userId);

    if (responseFromServer.access_token) {
      setToken(responseFromServer.access_token);
      setUserId(responseFromServer.userId);
      localStorage.setItem("token", responseFromServer.access_token);
      localStorage.setItem("userId", responseFromServer.userId);
      navigate("/home");
      return;
    }
    throw new Error(responseFromServer.message);
  };

  const logOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, userId, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProviderLocalStorge;

export const useAuth = () => {
  return useContext(AuthContext);
};
