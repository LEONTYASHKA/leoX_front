import { useEffect, useState } from "react";
import ApiManager from "../ApiManager/ApiManager";
import User from "../components/user/User";
import Menu from "../components/Menu";

const Users = () => {
  const [users, setUsers] = useState([] as any);
  
  useEffect(() => {
    async function fetchUesersData() {
      const users = await ApiManager.getUsers();
      console.log(users);
      setUsers(users);
    }
    fetchUesersData();
  }, []);

  return (
    <div>
      <Menu></Menu>
      {users.map(
        (user: { id: number; firstName: string; lastName: string }) => (
          <User
            id={user.id}
            fristName={user.firstName}
            lastName={user.lastName}
          ></User>
        )
      )}
    </div>
  );
};
export default Users;
