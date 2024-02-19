import { useEffect, useState } from "react";
import { messages, popUpMessage, quickMenu } from "../../../context/Appcontext";
import { updateMessageDelete } from "../../../utils/updateuser";
import { select } from "../../sidebar/Sidebarbox";
import { userProfile } from "../../../layout/Auth";
import { serverTimestamp } from "firebase/database";
import useExpirationDate from "../../../hooks/useExpirationDate";

const choices = ["Delete for every one", "Delete for me", "Cancel"];

const Delete = ({ modalRef }) => {
  const [sender, setSender] = useState(false);

  const { expired, checkExpiryDate } = useExpirationDate();

  const handleClick = async (choice) => {
    try {
      if (choice === "Delete for every one") {
        await updateMessageDelete(select.value, quickMenu.value.msgId, {
          every_one: {
            deleted: true,
            deletedAt: serverTimestamp(),
          },
        });

        popUpMessage.value = {
          message: "Message deleted for everyone",
          msgId: quickMenu.value.msgId,
        };
      } else if (choice === "Delete for me") {
        await updateMessageDelete(select.value, quickMenu.value.msgId, {
          [userProfile.value.phoneNumber]: {
            deleted: true,
            deletedAt: serverTimestamp(),
          },
        });

        popUpMessage.value = {
          message: "Message deleted for me",
          msgId: quickMenu.value.msgId,
        };
      }
    } catch (error) {
      console.log(error);
    } finally {
      quickMenu.value = null;
    }
  };

  // Checks who the sender of the selected message is.
  const checkWhoIsSender = () => {
    const findMessage = messages.value.find(
      (message) => message.msgId === quickMenu.value.msgId
    );

    // console.log(findMessage);
    if (findMessage.name === userProfile.value.phoneNumber) {
      setSender(true);
    } else {
      setSender(false);
    }
  };

  useEffect(() => {
    checkWhoIsSender();
    checkExpiryDate(quickMenu.value?.expirationDate);
    // console.log(quickMenu.value)
  }, [quickMenu.value.msgId]);

  return (
    <div
      ref={modalRef}
      className="w-[400px] flex flex-col bg-neutral-100 rounded-lg"
    >
      <span className="py-4 px-4">Delete message?</span>
      <div className="flex flex-col px-4 py-4">
        {choices.map((choice) => (
          <span
            key={choice}
            className={`
            ml-auto mb-2 
            py-1 px-4 
            rounded-full 
            border-2 
          border-neutral-400
          hover:bg-neutral-200
            cursor-pointer
            ${
              choice === "Delete for every one"
                ? sender
                  ? expired
                    ? "hidden"
                    : "block"
                  : "hidden"
                : null
            }
           `}
            onClick={() => handleClick(choice)}
          >
            {choice}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Delete;
