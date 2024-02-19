import { v4 as uuidv4 } from "uuid";
import { Chats, newChatTab } from "../../context/Appcontext";

import { userProfile } from "../../layout/Auth";
import getCurrentTime from "../../utils/getCurrentTime";

import { updateTargetUser, updateUser } from "../../utils/updateuser";
import newRoom from "../../utils/newRoom";
import { useState } from "react";

// Component for rendering profiles and creating chats
const Profiles = ({ profiles }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  // Function to create a new chat
  const createChat = async (phoneNumber) => {
    setIsLoading(true); // Set loading state to true
    try {
      const roomID = uuidv4(); // Generate a unique room ID
      const createdAt = getCurrentTime(); // Get current time

      const existingChat = Chats.value.find(
        (chat) => chat.participants[1].displayName === phoneNumber
      );
      const targetProfile = profiles.find(
        (profile) => profile.phoneNumber === phoneNumber
      );

      if (existingChat) {
        existingChat.deleted = false; // Set deleted status to false
        await updateUser(userProfile.value.uid, { chats: Chats.value }); // Update user's chats
      } else {
        // Create new chat for current user
        const newChat = [
          {
            roomId: `${roomID} ${createdAt}`,
            participants: [
              {
                displayName: userProfile.value.displayName
                  ? userProfile.value.displayName
                  : userProfile.value.phoneNumber,
              },
              {
                displayName: targetProfile.displayName
                  ? targetProfile.displayName
                  : targetProfile.phoneNumber,
              },
            ],
            createdAt: createdAt,
            muted: false,
            pinned: false,
            deleted: false,
            marked: false,
            blocked: false,
            lastMessage: null,
          },
          ...Chats.value,
        ];

        // Create new chat for target user
        const newTargetChat = [
          {
            roomId: `${roomID} ${createdAt}`,
            participants: [
              {
                displayName: targetProfile.displayName
                  ? targetProfile.displayName
                  : targetProfile.phoneNumber,
              },
              {
                displayName: userProfile.value.displayName
                  ? userProfile.value.displayName
                  : userProfile.value.phoneNumber,
              },
            ],
            createdAt: createdAt,
            muted: false,
            pinned: false,
            deleted: false,
            marked: false,
            blocked: false,
            lastMessage: null,
          },
          ...targetProfile.chats,
        ];

        // Update current user's chats
        await updateUser(userProfile.value.uid, { chats: newChat });

        // Update target user's chats
        await updateTargetUser(targetProfile.uid, { chats: newTargetChat });

        // Create new room in the database
        await newRoom(`${roomID} ${createdAt}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading state to false
      newChatTab.value = false; // Close the New Chat tab
    }
  };

  // Render profiles or loading indicator
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        profiles.map((profile) => (
          <div
            key={profile.uid}
            className="text-neutral-50 p-4 hover:bg-neutral-900 cursor-pointer"
            onClick={() => createChat(profile.phoneNumber)}
          >
            {profile.phoneNumber}
          </div>
        ))
      )}
    </>
  );
};

export default Profiles; // Export the Profiles component
