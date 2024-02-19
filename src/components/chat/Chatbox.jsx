import { useCallback, useEffect, useRef } from "react";
import { messages } from "../../context/Appcontext";
import { userProfile } from "../../layout/Auth";
import { select } from "../sidebar/Sidebarbox";
import { ref, onValue } from "firebase/database";
import { chatDb } from "../../firebase/Firebase";
import { retriveTime } from "../../utils/getCurrentTime";

import { GiCheckMark } from "react-icons/gi";

import MessageMenu from "./MessageMenu";
import { signal } from "@preact/signals-react";
import Emoji from "./Emoji";
import { updateMessage } from "../../utils/updateuser";
import { ImBlocked } from "react-icons/im";

export const messageMenuHover = signal(null);

const Chatbox = ({ selectedChat }) => {
  const messageMenuRef = useRef(null);

  const handleMouseEnter = useCallback((id) => {
    // Set the message ID as the value for messageMenuHover signal when mouse enters
    messageMenuHover.value = id;
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Reset messageMenuHover signal when mouse leaves
    messageMenuHover.value = null;

    // Close all message menus when mouse leaves
    if (!messageMenuHover.value) {
      const tempArray = messages.value.map((message) => ({
        ...message,
        showMenu: false,
      }));
      messages.value = tempArray;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const roomRef = ref(chatDb, `rooms/${select.value}`);

    const handleMessageSeen = async (messages) => {
      try {
        // Filter unseen messages
        const unseenMessages = messages.filter(
          (message) =>
            message.seen === false &&
            message.name !== userProfile.value.phoneNumber
        );

        // Update seen status for each unseen message
        await Promise.all(
          unseenMessages.map(async (message) => {
            const { msgId, selected, showMenu, ...messageWithoutMsgId } =
              message;

            // Update the message in the database to mark it as seen
            await updateMessage(select.value, msgId, {
              ...messageWithoutMsgId,
              seen: true,
            });
          })
        );
      } catch (error) {
        console.log(error.message);
      }
    };

    // Listen for changes in the roomRef data
    onValue(roomRef, async (snapshot) => {
      // Check if the component is still mounted before proceeding
      if (!isMounted) return;

      try {
        // Get the data from the snapshot
        const data = snapshot.val();

        // Check if data exists and if the roomRef key matches the selected chat
        if (data && roomRef.key === select.value) {
          // Convert the data into an array of messages, reverse it to display the latest messages first
          const tempArray = Object.entries(data)
            .map(([key, value]) => ({ msgId: key, ...value }))
            .reverse();

          // Update the messages value with the new array of messages
          messages.value = tempArray.map((message) => ({
            ...message,
            showMenu: false,
            selected: false,
          }));

          // Mark unseen messages as seen
          await handleMessageSeen(messages.value);
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [select.value]);

  return (
    <div
      className={`grow bg-neutral-50 overflow-y-auto snap-y py-10 flex flex-col-reverse`}
    >
      {/* message */}
      {messages.value &&
        messages.value.map((message) =>
          message.message ? (
            <div
              key={message.msgId}
              className={`px-10 flex ${
                message.name === userProfile.value?.phoneNumber
                  ? "justify-end"
                  : ""
              }
              ${
                message.deleteFor?.[userProfile.value.phoneNumber]?.deleted
                  ? "hidden"
                  : ""
              }
              mt-3 `}
              onMouseEnter={() => handleMouseEnter(message.msgId)}
              onMouseLeave={() => handleMouseLeave()}
            >
              {message.deleteFor?.every_one?.deleted ? (
                <div
                  className={`
                relative
                flex items-center 
                px-2 py-1 
                ${
                  message.name === userProfile.value?.phoneNumber
                    ? "bg-neutral-200 order-2 text-neutral-400"
                    : "bg-neutral-400 text-neutral-200"
                }
                rounded-md italic 
                z-[11]
                `}
                >
                  <ImBlocked className="mr-1" />
                  <span>message has been deleted</span>
                </div>
              ) : (
                <div
                  className={`
                relative
                px-2 pb-1 
                flex flex-col
                ${
                  message.name === userProfile.value?.phoneNumber
                    ? "bg-neutral-200 order-2"
                    : "bg-neutral-400"
                }
                rounded-md 
                min-w-[120px] 
                max-w-[600px] 
                break-words
                text-start
                z-[11]
                `}
                >
                  <span className="2xl:text-[16px] select-text">
                    {message.message}
                  </span>

                  {/* reaction */}
                  <span className="text-[10px] self-end flex items-center">
                    <span>{retriveTime(message.sent_time)}</span>

                    {message.name === userProfile.value?.phoneNumber ? (
                      <span
                        className={`${
                          message.seen ? "text-blue-800" : "text-neutral-400"
                        } text-[12px] ml-1`}
                      >
                        <GiCheckMark />
                      </span>
                    ) : null}
                  </span>
                  {message.reaction ? <Emoji msg={message} /> : null}
                </div>
              )}

              {/* menu */}
              <div className="flex items-center relative">
                <div
                  className={`absolute
                  ${
                    message.name === userProfile.value?.phoneNumber
                      ? `order-1 ${
                          messageMenuHover.value === message.msgId
                            ? "-left-8 duration-200 ease-in-out"
                            : ` left-0 duration-500 ease-in-out `
                        }`
                      : `order-2 ${
                          messageMenuHover.value === message.msgId
                            ? "right-1 duration-200 ease-in-out"
                            : "right-10 duration-500 ease-in-out"
                        }`
                  }
                flex  text-neutral-400 items-center
                `}
                >
                  <MessageMenu msg={message} messageMenuRef={messageMenuRef} />
                </div>
              </div>
            </div>
          ) : (
            <div
              key={message.timeStamp}
              className="mx-auto bg-yellow-200 px-2 py-1 rounded-sm"
            >
              {message.firstMessage}
            </div>
          )
        )}
    </div>
  );
};

export default Chatbox;
