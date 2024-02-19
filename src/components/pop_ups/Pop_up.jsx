import { useEffect, useState } from "react";
import { popUpMessage } from "../../context/Appcontext";
import PopupForDelete from "./PopupForDelete";

// Component for rendering pop-up messages
const Pop_up = () => {
  const [popUp, setPopUp] = useState(false); // State to control pop-up visibility

  // Effect to display the pop-up message and set timeout to hide it
  useEffect(() => {
    setPopUp(true); // Set pop-up visibility to true
    const timeOut = setTimeout(() => {
      setPopUp(false); // Hide the pop-up message
      popUpMessage.value = null; // Clear the pop-up message
    }, 3000); // Set timeout duration

    // Clean up the timeout when component unmounts
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  // Render the pop-up message
  return (
    <div
      className={`
      fixed
      bg-red-600 
      bg-opacity-90 
      top-14 right-[30%]
      z-50 
      px-4 py-2 rounded-md
      ${
        popUp
          ? "scale-100 translate-y-0 duration-300"
          : "scale-0 translate-y-[-100%] duration-300"
      }`}
    >
      {/* Render PopupForDelete component within the pop-up */}
      <PopupForDelete setPopUp={setPopUp} />
    </div>
  );
};

export default Pop_up; // Export the Pop_up component
