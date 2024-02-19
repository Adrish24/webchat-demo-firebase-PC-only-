import { IoVideocamOutline } from "react-icons/io5";
import { icons } from "../../styles/styles";
import { CiMenuKebab } from "react-icons/ci";
import { BiSearchAlt2 } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { selectedChat } from "../../context/Appcontext";

const ChatHeader = () => {
  // Render the chat header
  return (
    <div className="bg-neutral-800 px-4 py-3 flex justify-between h-[60px]">
      {/* Render the selected chat information */}
      {selectedChat.value && (
        <div className="flex gap-4 items-center cursor-pointer text-[40px] h-full px-3 text-neutral-600">
          {/* Render the profile image or placeholder */}
          {selectedChat.value.image ? (
            <img
              className="rounded-full object-contain w-[36px] border border-neutral-50"
              src={selectedChat.value.image}
            />
          ) : (
            <CgProfile />
          )}
          {/* Render the participant name and additional info */}
          <div className="flex flex-col">
            <span className="text-white text-[16px]">
              {selectedChat.value.participants[1].displayName}
            </span>
            <span className="text-neutral-300 text-[12px]">
              click here for more info
            </span>
          </div>
        </div>
      )}
      {/* Render icons for video call, search, and menu */}
      <div className="flex">
        {/* Video call icon */}
        <span className={icons} title="Video call">
          <IoVideocamOutline />
        </span>
        {/* Search icon */}
        <span className={icons} title="Search...">
          <BiSearchAlt2 />
        </span>
        {/* Menu icon */}
        <span className={`${icons} relative`} title="Menu">
          <CiMenuKebab />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
