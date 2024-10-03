import Alert from "./components/Alert";
import Button from "./components/Button";
import Input from "./components/Input";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm/login";
import RegistrationForm from "./components/RegistrationForm/Registration";
import PrivateRoutes from "./components/PrivateRoutes";
import Home from "./components/Home";
import PrivateRouteWithJWT from "./components/PrivateRouteWthJWT";
import AuthProviderLocalStorge from "./components/AuthProviderLocalStorge";
import Anonymous from "./components/Anonymous";
import Users from "./pages/Users";
import ChatsPreview from "./pages/Chats.preview";
import Chats from "./pages/Chats";
import Main from "./pages/Main";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <AuthProviderLocalStorge>
        <Routes>
          <Route element={<PrivateRouteWithJWT />}>
            {" "}
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/chats" element={<ChatsPreview />} />
            <Route path="/chats/:id" element={<Chats />} />
          </Route>
          <Route element={<Anonymous />}>
            <Route path="/login" element={<LoginForm />}></Route>
            <Route
              path="/auth/registration"
              element={<RegistrationForm />}
            ></Route>
          </Route>
        </Routes>
      </AuthProviderLocalStorge>
    </BrowserRouter>
  );
}
export default App;
