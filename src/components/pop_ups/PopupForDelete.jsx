import { popUpMessage } from "../../context/Appcontext";
import { restoreMessage } from "../../utils/updateuser";
import { select } from "../sidebar/Sidebarbox";

const PopupForDelete = ({ setPopUp }) => {
  const handleUndo = async () => {
    const msgId = popUpMessage.value?.msgId;
    setPopUp(false);
    popUpMessage.value = null;
    try {
      await restoreMessage(select.value, msgId);
      popUpMessage.value = {
        message: "Message restored",
      };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex">
      <span className="text-[14px]  font-medium">
        {popUpMessage.value.message}
      </span>
      {popUpMessage.value?.msgId ? (
        <span
          className="
      text-[16px] 
      text-yellow-300 
      font-semibold 
      cursor-pointer 
      hover:underline
      ml-4
      "
          onClick={handleUndo}
        >
          Undo
        </span>
      ) : null}
    </div>
  );
};

export default PopupForDelete;
