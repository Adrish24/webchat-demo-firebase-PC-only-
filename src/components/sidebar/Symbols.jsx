import { BiSolidVolumeMute } from "react-icons/bi";
import { BsFillPinAngleFill } from "react-icons/bs";
import { Chats } from "../../context/Appcontext";
import Notifications from "./Notifications";

const Symbols = ({ index, receiver }) => {
  return (
    <div className="flex">
      {/* Render volume mute icon if chat is muted */}
      <span className="text-[20px] text-neutral-800 ml-1">
        {Chats.value[index]?.muted ? <BiSolidVolumeMute /> : null}
      </span>
      {/* Render pin icon if chat is pinned */}
      <span className="text-[20px] ml-1 text-blue-900">
        {Chats.value[index]?.pinned ? <BsFillPinAngleFill /> : null}
      </span>
      {/* Render notifications if chat is marked */}
      <span className="ml-1 ">
        {Chats.value[index]?.marked ? <Notifications receiver={receiver} /> : null}
      </span>
    </div>
  );
};

export default Symbols;
