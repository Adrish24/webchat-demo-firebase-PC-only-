import { userProfile } from "../../layout/Auth";
import { emojiList, quickMenu } from "../../context/Appcontext";
import renderEmoji from "../../utils/renderEmoji";

const Emoji = ({ msg }) => {
  // Function to handle click on emoji reaction
  const handleClick = (reaction) => {
    try {
      // Set the quickMenu value with the key and msgId
      quickMenu.value = {
        key: "emojiList",
        msgId: msg.msgId,
      };

      // Set emojiList value with the rendered emoji reaction
      emojiList.value = renderEmoji(reaction);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`flex items-center ${
        msg.name === userProfile.value?.phoneNumber ? "justify-end mr-16" : ""
      }`}
    >
      {/* Map through each emoji in the reaction and render it */}
      {renderEmoji(msg.reaction).map((emoji, index) => (
        <span
          key={index}
          className="absolute w-5 cursor-pointer"
          title={emoji.title}
          onClick={() => handleClick(msg.reaction)}
        >
          <img src={emoji.src} alt={emoji.title} />
        </span>
      ))}
    </div>
  );
};

export default Emoji;
