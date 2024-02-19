import { CgProfile } from "react-icons/cg";
import { signal } from "@preact/signals-react";
import ReactDOM from "react-dom";
import { useCallback, useEffect, useRef } from "react";
import Menu, { menuTarget } from "./Menu";
import Menulist from "./Menulist";
import Symbols from "./Symbols";
import { userProfile } from "../../layout/Auth";
import { Chats, hoverStates, spanWidth, Width } from "../../context/Appcontext";
import { GiCheckMark } from "react-icons/gi";
import { updateUser } from "../../utils/updateuser";
import { ImBlocked } from "react-icons/im";
import ActivityStatus from "./ActivityStatus";

// Signal for setting the position
export const position = signal({ top: 0, left: 0 });
// Signal for selecting a chat
export const select = signal(null);

// Sidebar box component for displaying chats
const Sidebarbox = () => {
  const menuRef = useRef(null);
  const optionsRefs = useRef([]);
  const lastMessageSpanRefs = useRef([]);

  // Effect for updating chat width and span width
  useEffect(() => {
    let newWidthValues = [];
    lastMessageSpanRefs.current = lastMessageSpanRefs.current.slice(
      0,
      Chats.value.length
    );
    optionsRefs.current = optionsRefs.current.slice(0, Chats.value.length);

    if (optionsRefs.current) {
      optionsRefs.current.forEach((spanRef) => {
        if (spanRef) {
          newWidthValues.push(spanRef.offsetWidth);
        }
      });
    }

    Width.value = newWidthValues;

    if (lastMessageSpanRefs.current) {
      lastMessageSpanRefs.current.map((spanRef, index) => {
        if (window.innerWidth === 1536 && spanRef) {
          spanWidth.value = 300 - newWidthValues[index];
          spanRef.style.maxWidth = `${spanWidth.value}px`;
        }
        if (window.innerWidth === 1920 && spanRef) {
          spanWidth.value = 440 - newWidthValues[index];
          spanRef.style.maxWidth = `${spanWidth.value}px`;
        }
      });
    }
  }, [window.innerWidth, Chats.value, hoverStates.value]);

  // Effect for handling outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        const tempArray = Chats.value.map((user) => ({
          ...user,
          showMenu: false,
        }));
        Chats.value = tempArray;
      }

      if (!menuRef.current) {
        const tempArray = Chats.value.map((user) => ({
          ...user,
          showMenu: false,
        }));
        Chats.value = tempArray;
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Callback function for hover over chat
  const onHover = useCallback((id, index) => {
    hoverStates.value = id;
    if (hoverStates.value === id && lastMessageSpanRefs.current?.[index]) {
      lastMessageSpanRefs.current[index].style.maxWidth = `${
        lastMessageSpanRefs.current[index].offsetWidth - Width.value[index]
      }px`;
    }
  }, []);

  // Callback function for leaving hover on chat
  const onLeave = useCallback((index) => {
    hoverStates.value = null;
    if (!hoverStates.value && lastMessageSpanRefs.current?.[index]) {
      lastMessageSpanRefs.current[index].style.maxWidth = `${
        spanWidth.value - Width.value[index]
      }px`;
    }
  }, []);

  const menu = document.getElementById("chat-menu");

  // Callback function for handling click on chat
  const handleClick = useCallback(async (e, id) => {
    if (e.target !== menuTarget.value) {
      if (select.value === id) return;
      select.value = id;

      const chat = Chats.value.find((u) => u.roomId === id);

      chat.marked = false;

      const tempArray = Chats.value.map((chat) => {
        const { showMenu, ...rest } = chat;

        return {
          ...rest,
        };
      });

      await updateUser(userProfile.value.uid, { chats: tempArray }).catch(
        (err) => console.log(err.message)
      );
    }
  }, []);

  // Render sidebar box
  return (
    <div
      id="chat-container"
      className={`
        flex
        flex-col
        grow
        bg-neutral-300 
        overflow-y-auto 
        overflow-x-hidden 
        snap-y   
        z-[9]`}
    >
      {/* Map through the Chats array and render each chat */}
      {Chats.value &&
        Chats.value.map((chat, index) => (
          <div
            key={chat.roomId}
            className={`flex h-[75px]  cursor-pointer snap-start 
                ${
                  select.value === chat.roomId
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-200"
                }
                ${chat.deleted ? "hidden" : ""}
                `}
            onMouseEnter={() => onHover(chat.roomId, index)}
            onMouseLeave={() => onLeave(index)}
            onClick={(e) => handleClick(e, chat.roomId, index)}
          >
            {/* Display user profile image */}
            <div className="text-[40px] h-full px-3 text-neutral-600 flex items-center">
              {chat.image ? (
                <img
                  className="rounded-full object-contain w-[100px] border border-neutral-900"
                  src={chat.image}
                />
              ) : (
                <CgProfile />
              )}
            </div>

            {/* Display chat information */}
            <div className="grow flex flex-col justify-center pr-4 border-b border-neutral-100">
              {/* Display participant names and activity status */}
              <div
                className="flex justify-between items-center"
                title={
                  userProfile.value &&
                  (userProfile.value.phoneNumber ||
                    userProfile.value.displayName) ===
                    chat.participants[0].displayName
                    ? chat.participants[1].displayName
                    : chat.participants[0].displayName
                }
              >
                <span className="flex font-bold text-[16px] text-neutral-800">
                  <span>
                    {userProfile.value &&
                    (userProfile.value.phoneNumber ||
                      userProfile.value.displayName) ===
                      chat.participants[0].displayName
                      ? chat.participants[1].displayName
                      : chat.participants[0].displayName}
                  </span>
                  <div className="flex ml-2 my-auto pt-1">
                    <ActivityStatus chat={chat} />
                  </div>
                </span>
                {/* Display last message time */}
                {chat.lastMessage?.lastMessageTime ? (
                  <span className="text-[12px] text-neutral-700 font-thin">
                    {chat.lastMessage.lastMessageTime}
                  </span>
                ) : null}
              </div>

              {/* Display last message and options */}
              <div className="flex items-center relative h-[24px] overflow-hidden">
                {/* Display message deleted status */}
                {chat.lastMessage?.deletedMessage?.every_one?.deleted ? (
                  <div
                    className={`
                    flex items-center 
                    text-[14px]
                    text-neutral-500
                    italic 
                    w-full
                    `}
                  >
                    <ImBlocked className="mr-1" />
                    <span>message has been deleted</span>
                  </div>
                ) : (
                  <div
                    className="grow flex items-center overflow-hidden"
                    title={chat.lastMessage?.lastMessage}
                    ref={(el) => (lastMessageSpanRefs.current[index] = el)}
                  >
                    {/* Display message seen status */}
                    {chat.lastMessage?.name ===
                    (userProfile.value.phoneNumber ||
                      userProfile.value.displayName) ? (
                      <span
                        className={` ${
                          chat.lastMessage?.seen
                            ? "text-blue-800"
                            : "text-neutral-400"
                        } text-[10px] mr-1 pt-1`}
                      >
                        <GiCheckMark />
                      </span>
                    ) : null}
                    {/* Display last message */}
                    <span
                      className={`
                        font-semibold 
                        text-[14px]  
                        text-neutral-700 
                        overflow-hidden
                        text-ellipsis 
                        whitespace-nowrap
                        `}
                    >
                      {chat.lastMessage?.lastMessage}
                    </span>
                  </div>
                )}
                {/* Display chat symbols and menu */}
                <div
                  className={`
                  flex items-center  
                  `}
                  ref={(el) => (optionsRefs.current[index] = el)}
                >
                  {/* Display chat symbols */}
                  <Symbols
                    index={index}
                    receiver={chat.participants[1].displayName}
                  />
                  {/* Render menu icon if chat is hovered */}
                  <span>
                    {hoverStates.value === chat.roomId ? (
                      <Menu id={chat.roomId} menuRef={menuRef} />
                    ) : null}
                  </span>
                  {/* Render menu list portal if showMenu is true */}
                  {chat.showMenu
                    ? ReactDOM.createPortal(<Menulist id={chat.roomId} />, menu)
                    : null}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebarbox;
