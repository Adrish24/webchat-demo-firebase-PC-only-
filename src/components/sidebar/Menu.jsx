import { position } from "./Sidebarbox";
import { RiArrowDropDownLine } from "react-icons/ri";
import { signal } from "@preact/signals-react";
import { Chats } from "../../context/Appcontext";

export const menuTarget = signal(null);

let prevID;

const Menu = ({ id, menuRef }) => {
  const showMenu = (e, id) => {
    const button = document.getElementById("chat-menu-btn");
    const rect = button.getBoundingClientRect();
    
    // Set menu target and position based on button position
    menuTarget.value = e.target;
    if (rect.bottom > 500) {
      position.value = {
        top: rect.top - 184,
        left: rect.left
      };
    } else {
      position.value = {
        top: rect.bottom,
        left: rect.left
      };
    }
    
    // Toggle menu visibility and update previous chat's menu visibility
    const prevChat = Chats.value.find((user) => user.roomId === prevID);
    const chat = Chats.value.find((user) => user.roomId === id);

    if (prevChat && prevChat !== chat) {
      prevChat.showMenu = false;
    }
    chat.showMenu = !chat.showMenu;
    prevID = id;
  };

  return (
    <div
      id="chat-menu-btn"
      className="flex justify-center items-center ml-1"
      ref={menuRef}
      onClick={(e) => showMenu(e, id)}
    >
      <span className={`text-[24px] text-neutral-800  rounded-full hover:bg-neutral-300`}>
        <RiArrowDropDownLine />
      </span>
    </div>
  );
};

export default Menu;
