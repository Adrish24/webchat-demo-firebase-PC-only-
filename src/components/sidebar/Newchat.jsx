import { IoArrowBack } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { newChatTab } from "../../context/Appcontext";
import { icons } from "../../styles/styles";
import { profiles } from "../../ui/sidebar_ui/SidebarHeader";

import Profiles from "../profiles/Profiles";

// Component for rendering the New Chat section in the sidebar
const Newchat = () => {
  // Function to close the New Chat window
  const closeWindow = () => {
    newChatTab.value = false; // Set newChatTab value to false to close the window
  };

  // Render the New Chat section
  return (
    <div
      className={`bg-neutral-800 lg:h-[560px] xl:h-[760px] 2xl:h-[674px] lg:w-[358px] xl:w-[407px] 2xl:w-[387px] fixed ${
        newChatTab.value
          ? "translate-x-0 duration-300 ease-in-out"
          : "translate-x-[-100%] duration-300 ease-in-out"
      } z-[13] flex flex-col`}
    >
      {/* Header section */}
      <div className="flex items-center p-4  bg-neutral-700">
        {/* Back button */}
        <span className={icons} title="Groups" onClick={closeWindow}>
          <IoArrowBack className="text-neutral-50" />
        </span>
        {/* Title */}
        <span className="text-neutral-50 text-[20px] font-semibold ml-4">
          New Chat
        </span>
      </div>
      {/* Search bar */}
      <div className="flex p-3 h-[50px] items-center">
        <div className="grow flex bg-neutral-50 rounded-md pl-16 pr-8 items-center h-[35px] relative">
          {/* Search icon */}
          <span className="absolute left-[24px] cursor-pointer text-neutral-500 placeholder:text-neutral-500">
            <BiSearchAlt2 />
          </span>
          {/* Search input */}
          <input
            type="text"
            className="grow bg-transparent border-none outline-none text-neutral-950"
            placeholder="Search name or number"
          />
        </div>
      </div>
      {/* Render Profiles component if profiles.value exists */}
      <div>{profiles.value && <Profiles profiles={profiles.value} />}</div>
    </div>
  );
};

export default Newchat; // Export the Newchat component
