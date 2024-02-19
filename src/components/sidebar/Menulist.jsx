import { position, select } from "./Sidebarbox";
import { signal } from "@preact/signals-react";
import { chatMenu } from "../../data/data";
import { useEffect } from "react";
import { menuTarget } from "./Menu";
import { Chats, hoverStates } from "../../context/Appcontext";
import { updateUser } from "../../utils/updateuser";
import { userProfile } from "../../layout/Auth";

const menu = signal(null);

const Menulist = ({ id }) => {
  useEffect(() => {
    // Load chat menu options based on the chat ID
    menu.value = chatMenu(id);
  }, [id]);

  const handleClick = async (e, name) => {
    // Set the menu target and handle each menu option click
    menuTarget.value = e.target;

    // Find the chat object based on the ID
    const chat = Chats.value.find((u) => u.roomId === id);

    // Handle different menu options
    switch (name) {
      case "Mute notifications":
        await muteChat(chat, true);
        break;
      case "Unmute notifications":
        await muteChat(chat, false);
        break;
      case "Pin chat":
        await pinChat(chat, true);
        break;
      case "Unpin chat":
        await pinChat(chat, false);
        break;
      case "Delete chat":
        deleteChat(chat);
        break;
      case "Mark as Unread":
        await markAsReadChat(chat, true);
        break;
      case "Mark as read":
        await markAsReadChat(chat, false);
        break;
      case "Block":
        await blockChat(chat, true);
        break;
      case "Unblock":
        await blockChat(chat, false);
        break;
    }

    // Reset hover state
    hoverStates.value = null;
  };

  const muteChat = async (chat, boolean) => {
    // Update chat mute status and hide the menu
    chat.muted = boolean;
    chat.showMenu = false;
    await updateUser(userProfile.value.uid, { chats: Chats.value });
  };

  const pinChat = async (chat, boolean) => {
    // Update chat pin status and hide the menu
    chat.pinned = boolean;
    chat.showMenu = false;
    await updateUser(userProfile.value.uid, { chats: Chats.value });
  };

  const markAsReadChat = async (chat, boolean) => {
    // Update chat read status and hide the menu
    chat.marked = boolean;
    chat.showMenu = false;
    await updateUser(userProfile.value.uid, { chats: Chats.value });
  };

  const deleteChat = async (chat) => {
    // Delete chat and hide the menu
    chat.deleted = true;
    chat.pinned = false;
    chat.selected = false;
    chat.showMenu = false;
    await updateUser(userProfile.value.uid, { chats: Chats.value });
    select.value = null;
  };

  const blockChat = async (chat, boolean) => {
    // Update chat block status and hide the menu
    chat.blocked = boolean;
    chat.showMenu = false;
    await updateUser(userProfile.value.uid, { chats: Chats.value });
  };

  return (
    <div
      className="
      flex flex-col 
      justify-center 
      bg-neutral-800 
      text-white text-[12px] 
      py-2 rounded-md 
      absolute 
      z-[12]
      "
      style={position.value}
    >
      {/* Render each menu option */}
      {menu.value?.map((menulist) => (
        <span
          className="pl-8 pr-14 py-2 whitespace-nowrap hover:bg-neutral-700 cursor-pointer"
          key={menulist}
          onClick={(e) => handleClick(e, menulist)}
        >
          {menulist}
        </span>
      ))}
    </div>
  );
};

export default Menulist;
