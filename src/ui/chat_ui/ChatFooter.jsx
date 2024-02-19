import { icons } from "../../styles/styles";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { Message, updateRoom } from "../../utils/updateuser";
import { userProfile } from "../../layout/Auth";
import { select } from "../../components/sidebar/Sidebarbox";
import { selectedChat } from "../../context/Appcontext";
import { debounce } from "lodash";
import { custom } from "../../data/emojis";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const ChatFooter = ({ targetChat }) => {
  const [message, setMessage] = useState(""); // State to store the message being typed
  const [selectInput, setSelectInput] = useState(false); // State to manage whether input is selected
  const [sending, setSending] = useState(false); // State to manage the sending state of the message
  const [showEmjois, setShowEmjois] = useState(false); // State to manage the visibility of the emoji picker
  const textareaRef = useRef(null); // Reference to the textarea element

  // Function to handle input change in the textarea
  const handleInputChange = (event) => {
    setSelectInput(true);
    setMessage(event.target.value);
    // Dynamically adjust the height of the textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    // Check if the input is empty or contains only whitespace
    if (event.target.value === "" || event.target.value.trim() === "") {
      setSelectInput(false);
    }
  };

  // Function to send the message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // If message is empty, do nothing
    setSending(true); // Set sending state to true
    setShowEmjois(false); // Hide the emoji picker
    try {
      const newMessage = new Message(message, userProfile.value.phoneNumber, 2); // Create a new message object
      await updateRoom(select.value, { ...newMessage.createMessage() }); // Update the room with the new message
    } catch (error) {
      console.log(error.message);
    } finally {
      // Reset textarea height and clear message input
      if (textareaRef.current) {
        textareaRef.current.style.height = "20px";
      }
      setMessage("");
      setSelectInput(false);
      setSending(false); // Set sending state to false
    }
  };

  // Debounced version of sendMessage function to avoid rapid firing
  const debounceSendMessage = debounce(sendMessage, 300);

  // Function to handle Enter key press for sending messages
  const handleEnterKeyDown = async (e) => {
    try {
      if (e.key === "Enter") {
        e.preventDefault();
        debounceSendMessage(e);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to toggle visibility of the emoji picker
  const toggleEmojiTab = () => {
    setShowEmjois((prev) => !prev);
  };

  // Function to add emoji to the message
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    if (emoji) {
      setSelectInput(true);
    }
    setMessage(message + emoji);
  };

  // Reset emoji picker visibility when selected chat changes
  useEffect(() => {
    setShowEmjois(false);
  }, [select.value]);

  return (
    <div className="bg-neutral-800 flex justify-between">
      {/* Check if chat is blocked */}
      {selectedChat.value?.blocked || targetChat?.blocked ? (
        <div className="text-neutral-300 text-[14px] mx-auto py-[7.5px]">
          Can&apos;t send a message to blocked chat {selectedChat.value.participants[1].displayName}
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {showEmjois ? ( // Render emoji picker if showEmjois state is true
            <div className="bg-neutral-800 flex justify-center h-64 overflow-hidden">
              <Picker
                data={data}
                custom={custom}
                skinTonePosition="none"
                previewPosition="none"
                emojiSize={20}
                perLine={22}
                onEmojiSelect={addEmoji}
              />
            </div>
          ) : null}
          <form onSubmit={sendMessage} className="flex w-full px-4 py-3">
            <span className={icons} title="Emojies" onClick={toggleEmojiTab}>
              <BsEmojiSmile />
            </span>
            <span className={`${icons}`} title="Add">
              <IoMdAdd />
            </span>
            {/* Textarea for typing message */}
            <div className="bg-neutral-600 grow flex items-center px-2 py-1 rounded-md ml-2">
              <textarea
                ref={textareaRef}
                value={message}
                className="bg-transparent text-[14px] w-full h-[20px] border-none outline-none text-neutral-50 resize-none overflow-hidden"
                type="text"
                placeholder="Type a message..."
                onChange={handleInputChange}
                onKeyDown={handleEnterKeyDown}
              ></textarea>
            </div>
            {/* Button to send message */}
            <button
              type="submit"
              disabled={sending ? true : false}
              className={`${icons} relative`}
              title={selectInput ? "Send" : "Mic"}
            >
              {selectInput ? <IoSend /> : <FaMicrophone />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatFooter;
