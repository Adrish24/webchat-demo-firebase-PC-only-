import { FaGear, FaReply, FaShare } from "react-icons/fa6";
import { MdAddReaction, MdDelete } from "react-icons/md";
import { userProfile } from "../../layout/Auth";
import { quickMenu } from "../../context/Appcontext";
import { serverTimestamp } from "firebase/database";
import { updateMessageDelete } from "../../utils/updateuser";
import { select } from "../sidebar/Sidebarbox";

// Define menu options
const menu = [
  { key: "Reply", value: <FaReply /> },
  { key: "React", value: <MdAddReaction /> },
  { key: "Forward", value: <FaShare /> },
  { key: "Delete", value: <MdDelete /> },
];

let prevMessage;

const MessageMenu = ({ msg, messageMenuRef }) => {
  // Function to toggle message menu
  const showMenu = () => {
    if (prevMessage) {
      if (prevMessage !== msg) {
        prevMessage.showMenu = false;
      }
    }
    msg.showMenu = !msg.showMenu;
    prevMessage = msg;
  };

  // Function to handle selection from menu
  const handleSelect = (key) => {
    quickMenu.value = {
      key: key,
      msgId: msg.msgId,
      expirationDate: msg.expirationTime,
    };
  };

  // Function to delete a message
  const clearMessage = async (msg) => {
    await updateMessageDelete(select.value, msg.msgId, {
      [userProfile.value?.phoneNumber]: {
        deleted: true,
        deletedAt: serverTimestamp(),
      },
    });
  };

  return (
    <>
      {/* Menu button */}
      {msg.deleteFor?.every_one?.deleted ? (
        <div className="absolute flex" title="Delete">
          <span
            className={`p-1 cursor-pointer bg-neutral-900 text-neutral-200 rounded-full ${
              msg.name === userProfile.value?.phoneNumber ? "order-2" : "ml-3"
            }`}
            onClick={() => clearMessage(msg)}
          >
            <MdDelete />
          </span>
        </div>
      ) : (
        <div
          title="options"
          className={`flex z-10 bg-neutral-50 absolute ${
            msg.name === userProfile.value?.phoneNumber
              ? "order-2 pr-2"
              : "pl-2"
          }`}
        >
          <span
            className={`p-1.5 cursor-pointer bg-neutral-900 text-neutral-200 ${
              msg.name === userProfile.value?.phoneNumber
                ? `${
                    msg.showMenu
                      ? "rounded-r-full"
                      : "rounded-full duration-700 ease-in-out"
                  }`
                : `${
                    msg.showMenu
                      ? "rounded-l-full"
                      : "rounded-full duration-700 ease-in-out"
                  }`
            }`}
            onClick={() => showMenu(msg.msgId)}
            ref={messageMenuRef}
          >
            <FaGear />
          </span>
        </div>
      )}

      {/* Menu */}
      {msg.deleteFor?.every_one?.deleted ? null : (
        <div
          className={`flex bg-neutral-200 absolute ${
            msg.name === userProfile.value?.phoneNumber
              ? `${
                  msg.showMenu
                    ? "-left-28 duration-300 ease-in-out rounded-l-full"
                    : "left-0 duration-300 ease-in-out"
                }`
              : `${
                  msg.showMenu
                    ? "-right-[148px] duration-300 ease-in-out rounded-r-full"
                    : "-right-9 duration-300 ease-in-out"
                }`
          }`}
        >
          {menu.map((item) => (
            <span
              onClick={() => handleSelect(item.key)}
              key={item.key}
              title={item.key}
              className={`p-1.5 hover:bg-neutral-500 cursor-pointer ${
                msg.name === userProfile.value?.phoneNumber
                  ? `${item.key === "Reply" ? "rounded-l-full" : null}`
                  : `${item.key === "Delete" ? "rounded-r-full" : null}`
              }`}
            >
              {item.value}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default MessageMenu;
