import { FaWalkieTalkie } from "react-icons/fa6";

const CircleloadingScreen = () => {
  return (
    <div className="bg-neutral-800 h-full w-full flex justify-center items-center">
      <div className="w-[300px] h-[200px] flex flex-col items-center justify-evenly">
        <div className="text-[40px] duration-300">
          <FaWalkieTalkie />
        </div>
        <div className="w-12 overflow-hidden rounded-full">
          <img src="https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif" 
          className="w-full h-full object-cover contrast-75"/>
        </div>
      </div>
    </div>
  );
};

export default CircleloadingScreen;
