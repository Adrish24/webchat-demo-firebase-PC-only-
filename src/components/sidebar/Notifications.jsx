import { useEffect, useState } from "react";
import { UnreadMessages } from "../../context/Appcontext";

const Notifications = ({ receiver }) => {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const temp = UnreadMessages.value.find(
      (message) => message.senderName === receiver
    );
    if (temp !== 0) setMessageCount(temp);
  }, [UnreadMessages.value]);

  return (
    <div
      className="
    text-[12px] 
    bg-yellow-300 
    border-2s
    border-yellow-400s
    ml-1
    w-5
    h-5
    rounded-full
    text-center
    text-neutral-500
    font-semibold
    "
    >
      {messageCount && messageCount.unseenMessages}
    </div>
  );
};

export default Notifications;
