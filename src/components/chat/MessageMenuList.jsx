import { FaReply, FaShare } from "react-icons/fa6";
import { userProfile } from "../../layout/Auth";
import { MdAddReaction, MdDelete } from "react-icons/md";

const menu = [
  { key: "Reply", value: <FaReply /> },
  { key: "React", value: <MdAddReaction /> },
  { key: "Forward", value: <FaShare /> },
  { key: "Delete", value: <MdDelete /> },
];



const MessageMenuList = ({msg}) => {
  return (
    <div
    className={`flex bg-neutral-200 
               ${
                 msg.name === userProfile.value?.phoneNumber
                   ? `${
                       msg.showMenu
                         ? "translate-x-[0%] duration-300 ease-in-out rounded-l-full"
                         : "translate-x-[100%] duration-300 ease-in-out"
                     }`
                   : `${
                       msg.showMenu
                         ? "translate-x-[0%] duration-300 ease-in-out rounded-r-full"
                         : "translate-x-[-100%] duration-300 ease-in-out"
                     }`
               }
              `}
  >
    {menu.map((item) => (
      <span
        key={item.key}
        title={item.key}
        className={`p-1.5 hover:bg-neutral-500  cursor-pointer ${
          msg.name === userProfile.value?.phoneNumber
            ? `${item.key === "Reply" ? "rounded-l-full" : null}`
            : `${item.key === "Delete" ? "rounded-r-full" : null}`
        }`}
      >
        {item.value}
      </span>
    ))}
  </div>
  )
}

export default MessageMenuList
