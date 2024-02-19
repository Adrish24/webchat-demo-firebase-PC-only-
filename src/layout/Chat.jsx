import Chatbox from "../components/chat/Chatbox";
import ChatHeader from "../ui/chat_ui/ChatHeader";
import ChatFooter from "../ui/chat_ui/ChatFooter";
import { select } from "../components/sidebar/Sidebarbox";
import { useEffect, useState } from "react";
import { Chats, selectedChat } from "../context/Appcontext";
import { profiles } from "../ui/sidebar_ui/SidebarHeader";

const Chat = () => {
  // State to store the target chat
  const [targetChat, setTargetChat] = useState(null);

  useEffect(() => {
    // Find the selected chat from the global state
    const chat = Chats.value.find((chat) => chat.roomId === select.value);

    // If no chat is selected, return
    if (!chat) return;

    // Set the selected chat in the global state
    selectedChat.value = chat;

    // Find the profile of the target chat participant
    const targetProfile = profiles.value?.find(
      (profile) => profile.phoneNumber === chat.participants[1].displayName
    );

    // Find the chat object corresponding to the selected chat in the target profile's chats array
    const receiverChat = targetProfile?.chats?.find(
      (chat) => chat.roomId === select.value
    );

    // Set the target chat
    setTargetChat(receiverChat);
  }, [select.value, Chats.value]);

  return (
    <div className="w-[75%] relative border-l border-neutral-400 flex flex-col">
      {select.value ? (
        <>
          {/* Render chat header */}
          <ChatHeader />
          {/* Render chat messages */}
          <Chatbox />
          {/* Render chat footer */}
          <ChatFooter targetChat={targetChat} />
        </>
      ) : (
        // Render message to select a chat if none is selected
        <div className="bg-neutral-700 grow flex justify-center items-center text-2xl font-semibold text-white">
          Select a chat
        </div>
      )}
    </div>
  );
};

export default Chat;
