import { useState } from "react";
import { emojiList, quickMenu } from "../../../context/Appcontext";
import { quickReactEmojiTab } from "../../../data/emojis";
import { userProfile } from "../../../layout/Auth";
import { removeReaction } from "../../../utils/updateuser";

import { select } from "../../sidebar/Sidebarbox";


const ReactionList = ({ modalRef }) => {
  const [selected, setSelected] = useState(null);
  const [selectAll, setSelectAll] = useState(true);
  const [sortedReactions, setSortedReactions] = useState(null);

 

  const getEmojiCount = (emoji) => {
    const count = emojiList.value.filter(
      (item) => item.title === emoji.title
    ).length;

    // console.log(count);
    return count === 0 ? null : (
      <div
        className={`
        flex items-center 
        px-3 pt-4 pb-2 
       
        cursor-pointer
        ${
          selected === emoji.title
            ? "border-b-[3px] border-neutral-50"
            : " border-b-[3px] border-neutral-900 "
        }
        `}
        key={emoji.id}
        title={emoji.title}
        onClick={() => handleSelect(emoji.title)}
      >
        <img className="w-5" src={emoji.src} alt={emoji.title} />
        <span className="ml-1 text-[14px]">{count}</span>
      </div>
    );
  };

  const handleSelect = (title) => {
    setSelected(title);
    setSelectAll(false);
    try {
      const filteredArray = emojiList.value.filter(
        (emoji) => emoji.title === title
      );

      setSortedReactions(filteredArray);

      //   console.log(title);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(true);
    setSelected(null);
  };

  const removeEmoji = async (item) => {
    try {
      if(userProfile.value?.phoneNumber === item.name){
        await removeReaction(select.value, quickMenu.value.msgId, item.reactId);
        quickMenu.value = null;
      }    
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div className="py-2 flex flex-col rounded-lg w-[400px] " ref={modalRef}>
      <div className="flex w-full px-5 bg-neutral-900 text-neutral-300 rounded-t-lg">
        <div
          className={`
        flex items-center 
        w-[44px]  
        pt-4 pb-2 pr-3 
        cursor-pointer
        ${
          selectAll
            ? "border-b-[3px] border-neutral-50"
            : " border-b-[3px] border-neutral-900 "
        }
        `}
          onClick={handleSelectAll}
        >
          <span>All</span>
          <span className="ml-1 grow">{emojiList.value.length}</span>
        </div>
        {quickReactEmojiTab.map((emoji) => getEmojiCount(emoji))}
      </div>
      <div className="flex flex-col bg-neutral-300 h-[240px] overflow-y-auto overflow-x-hidden rounded-b-lg pt-2">
        {selectAll
          ? emojiList.value.map((item, i) => (
              <div
                onClick={() => removeEmoji(item)}
                key={i}
                className="flex justify-between items-center h-[48px] px-5 mb-1 hover:bg-neutral-200 cursor-pointer"
              >
                <div className="flex flex-col font-semibold">
                  <span>
                    {item.name === userProfile.value?.phoneNumber
                      ? "You"
                      : item.name}
                  </span>
                  {item.name === userProfile.value?.phoneNumber ? (
                    <span className="text-[12px]">Click to remove</span>
                  ) : null}
                </div>
                <span className="w-6">
                  <img src={item.src} alt={item.title} />
                </span>
              </div>
            ))
          : sortedReactions.map((item, i) => (
              <div
                onClick={() => removeEmoji(item)}
                key={i}
                className="flex justify-between items-center h-[48px] px-5 mb-1 hover:bg-neutral-200 cursor-pointer"
              >
                <div className="flex flex-col font-semibold">
                  <span>
                    {item.name === userProfile.value?.phoneNumber
                      ? "You"
                      : item.name}
                  </span>
                  {item.name === userProfile.value?.phoneNumber ? (
                    <span className="text-[12px]">Click to remove</span>
                  ) : null}
                </div>
                <span className="w-6">
                  <img src={item.src} alt={item.title} />
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ReactionList;
