import { icons } from "../../styles/styles";

import { FaWalkieTalkie } from "react-icons/fa6";

const SidebarFooter = () => {
  return (
    <div className="
    bg-neutral-800 
    px-4 py-3 flex 
    items-center 
    text-neutral-100 
    font-semibold 
    z-[12]">
      <span className={icons}>
        <FaWalkieTalkie />
      </span>
      Wolkie-Talkie
    </div>
  );
};

export default SidebarFooter;
