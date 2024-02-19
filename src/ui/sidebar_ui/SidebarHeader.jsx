import { CgProfile } from "react-icons/cg";
import { RiChatNewFill, RiGroupLine } from "react-icons/ri";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { CiMenuKebab } from "react-icons/ci";

import { icons } from "../../styles/styles";
import { sidebarMenu } from "../../data/data";
import { useEffect, useRef, useState } from "react";

import Logout from "../../components/auth/Logout";

import { signal } from "@preact/signals-react";
import { userProfile } from "../../layout/Auth";

import { newChatTab } from "../../context/Appcontext";

// Signal for profiles
export const profiles = signal(null);

// Component for the header section of the sidebar
const SidebarHeader = () => {
  const [show, setShow] = useState(false); // State for menu visibility

  const menuRef = useRef(null); // Reference for menu

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShow(false);
      }

      if (!menuRef.current) {
        setShow(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Function to toggle menu visibility
  const handleClick = () => {
    setShow((prev) => !prev);
  };

  // Function to handle new chat
  const handleNewChat = async () => {
    newChatTab.value = true;
  };

  return (
    <div className="bg-neutral-800 px-4 py-3 flex justify-between h-[60px] z-[11]">
      {/* Profile icon */}
      <div
        className={`text-[36px] ${
          userProfile.value?.status === "online"
            ? "text-green-600"
            : userProfile.value?.status === "idle"
            ? "text-yellow-600"
            : "text-neutral-600"
        }`}
      >
        <CgProfile />
      </div>
      {/* User phone number */}
      {userProfile.value && (
        <div className="font-semibold text-neutral-50 my-auto">
          {userProfile.value.phoneNumber}
        </div>
      )}
      {/* Icons for Groups, Status, New chat, and Menu */}
      <div className="flex relative">
        <span className={icons} title="Groups">
          <RiGroupLine />
        </span>
        <span className={icons} title="Status">
          <HiOutlineStatusOnline />
        </span>
        <span title="New chat" className={icons} onClick={handleNewChat}>
          <RiChatNewFill />
        </span>
        <span
          className={`${icons} relative`}
          title="Menu"
          onClick={handleClick}
          ref={menuRef}
        >
          <CiMenuKebab />
          {/* Menu options */}
          {show && (
            <div className="absolute top-10 right-0 bg-neutral-50 z-10 flex flex-col py-2 rounded-md">
              {sidebarMenu.map((menu) => (
                <span
                  key={menu}
                  className="text-[14px] text-black px-4 py-2 whitespace-nowrap hover:bg-neutral-300"
                >
                  {menu}
                </span>
              ))}
              <Logout />
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default SidebarHeader; // Export the SidebarHeader component
