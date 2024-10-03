import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <nav className="menu">
      <ul>
        <Link to="/home">
          <li> Profile</li>
        </Link>

        <Link to="/chats">
          <li> Chats</li>
        </Link>
        <Link to="/users">
          <li> Users</li>
        </Link>
      </ul>
    </nav>
  );
};
export default Menu;
