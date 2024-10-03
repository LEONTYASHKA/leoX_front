import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProviderLocalStorge";

const Anonymous = () => {
  const user = useAuth();
  return user.token ? <Navigate to="/home" replace /> : <Outlet />;
};
export default Anonymous;
