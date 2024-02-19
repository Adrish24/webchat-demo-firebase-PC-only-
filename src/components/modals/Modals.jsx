import { quickMenu } from "../../context/Appcontext";
import QuickReact from "./message_modals/QuickReact";
import Delete from "./message_modals/Delete";
import { useRef } from "react";
import ReactionList from "./message_modals/ReactionList";

// Component for rendering message modals
const Modals = () => {
  const modalRef = useRef(null); // Reference to modal container element

  // Function to handle click outside modal to close it
  const handleClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      quickMenu.value = null; // Set quickMenu value to null to close modal
    }
  };

  // Render the modal based on the quickMenu value
  return (
    <div
      onClick={handleClick}
      className="
    h-screen w-full  
    absolute bg-neutral-900 bg-opacity-90
    top-0 left-0 
    z-50
    flex justify-center items-center
    "
    >
      {quickMenu.value.key === "React" ? (
        // Render QuickReact modal if quickMenu value is "React"
        <QuickReact modalRef={modalRef} />
      ) : null}
      {quickMenu.value.key === "Delete" ? (
        // Render Delete modal if quickMenu value is "Delete"
        <Delete modalRef={modalRef} />
      ) : null}
      {quickMenu.value.key === "emojiList" ? (
        // Render ReactionList modal if quickMenu value is "emojiList"
        <ReactionList modalRef={modalRef} />
      ) : null}
    </div>
  );
};

export default Modals; // Export the Modals component
