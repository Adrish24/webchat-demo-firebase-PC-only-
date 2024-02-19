import { useEffect, useState } from "react";
import SignIn from "../components/auth/SignIn";
import Verification from "../components/auth/Verification";
import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import getUser from "../utils/getUser";

import { signal } from "@preact/signals-react"; // Importing signal from signals-react library
import LoadingScreen from "../components/LoadingScreen";
import {
  Chats,
  UnreadMessages,
  lastMessages,
  popUpMessage,
  quickMenu,
  storedRooms,
} from "../context/Appcontext"; // Importing various context providers

import { onValue, ref } from "firebase/database"; // Importing necessary functions from Firebase database module
import { chatDb, userDb } from "../firebase/Firebase"; // Importing chatDb and userDb from Firebase
import { updateUser } from "../utils/updateuser"; // Importing updateUser function from updateuser utility
import ding from "/assets/audio/ding.mp3"; // Importing the ding sound file
import useDataEncryption from "../hooks/useDataEncryption"; // Importing custom hook for data encryption
import Modals from "../components/modals/Modals"; // Importing Modals component
import { select } from "../components/sidebar/Sidebarbox"; // Importing select function from Sidebarbox component
import Pop_up from "../components/pop_ups/Pop_up"; // Importing Pop_up component
import PopupForAlredyLogin from "../components/pop_ups/PopupForAlredyLogin"; // Importing PopupForAlreadyLogin component
import { profiles } from "../ui/sidebar_ui/SidebarHeader"; // Importing profiles from SidebarHeader component
import getUsers from "../utils/getUsers"; // Importing getUsers function from getUsers utility
import { doc, onSnapshot } from "firebase/firestore"; // Importing necessary functions from Firebase firestore module
import { retriveTime } from "../utils/getCurrentTime"; // Importing retriveTime function from getCurrentTime utility

export const userProfile = signal(null); // Creating a signal for user profile updates

let timeoutId; // Variable to hold timeout ID
let result; // Variable to hold result

const timer = 600000; // Timer duration for user activity

// Auth component responsible for handling authentication and user activity
const Auth = () => {
  const { submited, verified, setVerified, user, alreadyLoggedInStatus } =
    useAuth(); // Destructuring necessary values from useAuth context
  const [loading, setLoading] = useState(true); // State for loading status
  const [IsActive, setIsActive] = useState(false); // State for user activity status
  const { encryptData, decryptData } = useDataEncryption(); // Destructuring encryptData and decryptData functions from useDataEncryption hook

  // Function to reset user activity timeout
  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clearing existing timeout
    }

    timeoutId = setTimeout(() => {
      setIsActive(false); // Setting user activity status to inactive
      if (user) {
        updateUser(user.uid, { status: "idle" }); // Updating user status to idle
      }
      handleOffline(); // Handling user offline status
      console.log("user Inactive"); // Logging user inactivity
    }, timer); // Setting timeout duration
  };

  // Function to handle user activity
  const handleActivity = async () => {
    setIsActive(true); // Setting user activity status to active
    if (user) {
      await updateUser(user.uid, { status: "online" }); // Updating user status to online
    }
    resetTimeout(); // Resetting user activity timeout
  };

  // Function to handle user offline status
  const handleOffline = () => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clearing existing timeout
    }

    timeoutId = setTimeout(() => {
      if (user) {
        updateUser(userProfile.value?.uid, { status: "offline" }); // Updating user status to offline
      }
    }, timer); // Setting timeout duration
  };

  useEffect(() => {
    let isMounted = true; // Boolean flag to track component mount status
    const retriveData = async () => {
      if (!isMounted) return; // Avoid data retrieval if component is unmounted
      try {
        if (user) {
          // Retrieve user data and set verified status
          userProfile.value = await getUser(user.uid);
          if (userProfile.value) {
            setVerified(true);
            await updateUser(userProfile.value.uid, { status: "online" });
          }
          // Retrieve profiles and update chat list
          profiles.value = await getUsers(user.uid);
          const userRef = doc(userDb, "Users", `${userProfile.value?.uid}`);
          const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const userdata = snapshot.data();
              userProfile.value = userdata;
              const chatArray = userdata.chats;
              const tempArray = chatArray.sort((a, b) => {
                if (a.pinned && !b.pinned) {
                  return -1;
                } else if (!a.pinned && b.pinned) {
                  return 1;
                } else {
                  return 0;
                }
              });
              Chats.value = tempArray;
            } else {
              console.log("User document does not exist.");
            }
          });
          // Update profiles' status
          profiles.value?.forEach((profile) => {
            const profileRef = doc(userDb, "Users", `${profile.uid}`);
            const temp = onSnapshot(profileRef, (snapshot) => {
              if (snapshot.exists()) {
                const profileData = snapshot.data();
                const foundProfile = profiles.value.find(
                  (profile) => profile.uid === profileData.uid
                );
                foundProfile.status = profileData.status;
              }
            });
            return () => {
              temp();
            };
          });
          // Cleanup functions
          return () => {
            unsubscribe(); // Unsubscribe from snapshot listener
          };
        } else {
          setVerified(false); // Set verified status to false if no user is logged in
        }
      } catch (error) {
        console.log(error); // Log any errors that occur during data retrieval
      }
    };
    retriveData(); // Call the data retrieval function
    // Cleanup function to set isMounted to false when component is unmounted
    return () => {
      isMounted = false;
    };
  }, [user]); // Dependency array containing user, triggering useEffect on user changes

  useEffect(() => {
    if (!user) return; // Return early if user is not authenticated
    let isMounted = true; // Boolean flag to track component mount status
    const roomRef = ref(chatDb, `rooms`); // Reference to the 'rooms' collection in the Firebase database

    // Function to display notification for unseen messages
    const showNotification = (unseenMessages) => {
      unseenMessages.map((message) => {
        new Notification(message.name, {
          body: message.message,
        });
      });
    };

    // Function to handle unread messages
    const unReadMessage = (lastMessage) => {
      // Find the chat associated with the last message
      const chat = Chats.value.find(
        (chat) => chat.participants[1].displayName === lastMessage.name
      );

      // Check if the last message has been seen
      if (!lastMessage.seen) {
        // If the chat exists and is not currently selected
        if (chat) {
          if (select.value !== chat.roomId) {
            // Mark the chat as unread
            chat.deleted = false;
            chat.marked = true;
          }
        }
      }
    };

    // Function to sort last messages and set unread messages
    const sortingLastMessagesAndsettingUnreadMessages = (array) => {
      // Map through each chat room in the array
      const temp = array.map((room) => {
        // Extract messages from the room
        const messages = Object.values(room[1]);
        // Get the last message in the room
        let lastMessages = messages[messages.length - 1];

        // Check if the last message is deleted for the current user
        if (
          lastMessages?.deleteFor?.[userProfile.value?.phoneNumber]?.deleted
        ) {
          // Find the last message that is not deleted for the current user
          lastMessages = messages
            .slice()
            .reverse()
            .find(
              (message) => !message.deleteFor?.[userProfile.value?.phoneNumber]
            );
        }

        // Set unread message status
        unReadMessage(lastMessages);

        // Return object containing room ID, last message, last message time, and other details
        return {
          roomId: room[0],
          lastMessage: lastMessages?.message,
          lastMessageTime: retriveTime(lastMessages?.sent_time),
          seen: lastMessages?.seen,
          name: lastMessages?.name,
          deletedMessage: lastMessages?.deleteFor
            ? lastMessages?.deleteFor
            : null,
        };
      });
      return temp; // Return the array containing sorted last messages and unread messages
    };

    // Function to determine the number of unseen messages and sender's name in each chat room
    const unseenMessages = (array) => {
      // Map through each chat room in the array
      const tempArray = array.map((room) => {
        // Extract messages from the room
        const messages = Object.values(room[1]);
        // Ensure storedRooms is available
        if (!storedRooms.value) return;

        // Find the corresponding stored room
        const findstoredRoom = storedRooms.value.find((r) => r[0] === room[0]);
        // If no stored room found, return
        if (!findstoredRoom) return;

        // Extract stored messages
        const storedMessages = Object.values(findstoredRoom[1]);

        // Filter stored unseen messages
        const storedUnseenMessages = storedMessages.filter(
          (message) =>
            message.seen === false &&
            message.name !== userProfile.value?.phoneNumber
        );

        // Filter unseen messages in the current room
        const unseenMessages = messages.filter(
          (message) =>
            message.seen === false &&
            message.name !== userProfile.value?.phoneNumber
        );

        // Find the corresponding chat in Chats context
        const findChat = Chats.value.find(
          (chat) => chat.participants[1].displayName === unseenMessages[0]?.name
        );

        // Check if there are new unseen messages
        if (unseenMessages.length > storedUnseenMessages.length) {
          if ("Notification" in window) {
            // Request permission for notifications
            Notification.requestPermission().then((permission) => {
              if (permission === "granted" && !IsActive) {
                // Show desktop notification for new messages if user is not active
                showNotification(unseenMessages);
              } else if (!findChat.muted) {
                // Play a notification sound if chat is not muted
                const audio = new Audio(ding);
                audio.play();
              }
            });
          }
        }

        // Return object containing the count of unseen messages and sender's name
        return {
          unseenMessages: unseenMessages.length,
          senderName: unseenMessages[0]?.name,
        };
      });
      return tempArray; // Return the array containing information about unseen messages
    };

    // Function to update the last message in each chat
    const lastMessage = async (lastMessages) => {
      try {
        // Map through each chat in Chats context
        const newArry = Chats.value.map((chat) => {
          // Find the last message for the current chat
          const findMessage = lastMessages.find(
            (item) => item.roomId === chat.roomId
          );

          // If a last message is found, update the chat with it
          if (findMessage) {
            const lastMessage = findMessage.lastMessage ? findMessage : null;

            return {
              ...chat,
              lastMessage: lastMessage,
            };
          }
        });

        // Update the user's chats with the new array containing updated last messages
        if (userProfile.value?.uid && newArry.length > 0) {
          await updateUser(userProfile.value.uid, { chats: newArry });
        }
      } catch (error) {
        console.error(error); // Log any errors that occur during the process
      }
    };

    // Listening for changes in the room reference
    onValue(roomRef, async (snapshot) => {
      if (!isMounted) return; // Ignore updates if component is unmounted

      const data = snapshot.val(); // Extracting data from the snapshot

      if (data) {
        // Retrieve stored rooms from local storage if available
        result = localStorage.getItem(`${userProfile.value?.uid}`);
        if (result && result.length > 0) {
          storedRooms.value = decryptData(result, userProfile.value?.uid);
        }

        // Convert data to an array of room entries
        const tempRoomsArray = Object.entries(data).map((value) => ({
          ...value,
        }));

        // Update last messages and unread messages values
        lastMessages.value =
          sortingLastMessagesAndsettingUnreadMessages(tempRoomsArray);
        UnreadMessages.value = unseenMessages(tempRoomsArray);

        // Update last message in each chat
        await lastMessage(lastMessages.value);

        // Encrypt and store the updated rooms array in local storage
        result = encryptData(tempRoomsArray, userProfile.value?.uid);
        localStorage.setItem(`${userProfile.value?.uid}`, result);
      }
    });

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false when component is unmounted
    };
  }, [IsActive]); // Dependency array containing IsActive, triggering useEffect on IsActive changes

  useEffect(() => {
    // loading screen
    const timeOut = setTimeout(() => {
      setLoading(false);
      handleActivity();
    }, 8500);

    // Attach event listeners
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Clean up event listeners on component unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearTimeout(timeOut);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  useEffect(() => {
    // Function to handle application close event
    const handleAppClose = async (e) => {
      e.preventDefault(); // Prevent the default browser behavior

      // Update user status to offline before the application closes
      await updateUser(userProfile.value?.uid, { status: "offline" });

      return ""; // Return an empty string to satisfy browser requirements
    };

    // Add event listener for beforeunload event
    window.addEventListener("beforeunload", handleAppClose);

    // Remove event listener when component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleAppClose);
    };
  }, []); // Dependency array is empty, ensuring the effect runs only once on component mount


  return (
    <>
      {loading ? (
        // Render loading screen if data is still loading
        <LoadingScreen />
      ) : submited ? (
        // Render verification component if user has submitted credentials
        <Verification />
      ) : verified ? (
        // Render sidebar and chat components if user is verified
        <div className="flex grow h-full">
          {quickMenu.value ? <Modals /> : null}
          {popUpMessage.value ? <Pop_up /> : null}
          <Sidebar />
          <Chat />
        </div>
      ) : (
        // Render sign-in component if user is not yet verified
        <div className="flex m-auto">
          {alreadyLoggedInStatus.logged_in ? <PopupForAlredyLogin /> : null}
          <SignIn />
        </div>
      )}
    </>
  );

};

export default Auth;
