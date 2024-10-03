import { useState } from "react";
import Menu from "../components/Menu";

const Main = () => {
  const [currentPage, setCurrentPage] = useState("");
  function render() {
    if (currentPage == "chats") {
      return <div>Chats</div>;
    } else if (currentPage == "profile") {
      return <div>Profile</div>;
    }
  }
  return (
    <div>
      <div className="content">{render()}</div>
      <div className="menu">
        <Menu
          onclickChats={function () {
            setCurrentPage("chats");
          }}
          onclickProfile={function () {
            setCurrentPage("profile");
          }}
        />
      </div>
    </div>
  );
};

export default Main;
