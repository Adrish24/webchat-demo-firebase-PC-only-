import { messages, quickMenu, selectedChat } from "../../../context/Appcontext";
import { quickReactEmojiTab } from "../../../data/emojis";
import { select } from "../../sidebar/Sidebarbox";
import { ref, update } from "firebase/database";
import { chatDb } from "../../../firebase/Firebase";
import { userProfile } from "../../../layout/Auth";
import { updateReactions } from "../../../utils/updateuser";

const QuickReact = ({ modalRef }) => {
  const handleSelect = async (title, src) => {
    // console.log(quickMenu.value);
    try {
      const findMessage = messages.value.find(
        (message) => message.msgId === quickMenu.value.msgId
      );
      // console.log(findMessage);
      // console.log(selectedChat.value)

      // console.log(findMessage.reaction);
      if (findMessage.reaction) {
        const reactions = Object.entries(findMessage.reaction).map(
          ([key, value]) => ({ reactId: key, ...value })
        );

        const existingReation =
          findMessage.name === userProfile.value?.phoneNumber
            ? reactions.find(
                (react) => react.name === userProfile.value?.phoneNumber
              )
            : findMessage.name !== selectedChat.value?.participants[0].displayName
            ? reactions.find(
                (react) => react.name === userProfile.value?.phoneNumber
              )
            : reactions.find(
                (react) => react.name !== userProfile.value?.phoneNumber
              );

        if (existingReation) {
          const { reactId, ...value } = existingReation;
          const reactionRef = ref(
            chatDb,
            `rooms/${select.value}/${quickMenu.value.msgId}/reaction/${reactId}`
          );
          update(reactionRef, {
            ...value,
            title: title,
            src: src,
          });
        } else {
          await updateReactions(select.value, quickMenu.value.msgId, {
            name:
              findMessage.name === userProfile.value?.phoneNumber
                ? userProfile.value?.phoneNumber
                : findMessage.name !== selectedChat.value?.participants[0].displayName
                ? selectedChat.value?.participants[0].displayName
                : selectedChat.value?.participants[1].displayName,
            title: title,
            src: src,
          });
        }
      } else {
        await updateReactions(select.value, quickMenu.value.msgId, {
          name:
            findMessage.name === userProfile.value?.phoneNumber
              ? userProfile.value?.phoneNumber
              : findMessage.name !== selectedChat.value?.participants[0].displayName
              ? selectedChat.value?.participants[0].displayName
              : selectedChat.value?.participants[1].displayName,
          title: title,
          src: src,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      quickMenu.value = null;
    }
  };

  return (
    <div
      className="p-10 bg-neutral-950 text-neutral-50 flex rounded-lg w-auto"
      ref={modalRef}
    >
      {quickReactEmojiTab.map((emoji) => (
        <span
          onClick={() => handleSelect(emoji.title, emoji.src)}
          key={emoji.id}
          className="w-10 m-3 cursor-pointer"
          title={emoji.title}
        >
          <img src={emoji.src} alt="emoji" />
        </span>
      ))}
    </div>
  );
};

export default QuickReact;
