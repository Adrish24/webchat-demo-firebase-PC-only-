import { FaWalkieTalkie } from "react-icons/fa6";
import { useEffect, useState } from "react";

// Component for the loading screen
const LoadingScreen = () => {
  const [fill, setFill] = useState(0); // State for fill percentage of loading bar
  const [position, setPosition] = useState(0); // State for position of walkie-talkie icon

  // Effect to animate walkie-talkie icon position
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let value;
        if (prev === 0) {
          value = prev + 10;
          return value;
        } else {
          return (value = 0);
        }
      });
    }, 300);

    // Clean up the interval when component unmounts or position changes
    return () => {
      clearInterval(interval);
    };
  }, [position]);

  // Effect to animate loading bar fill
  useEffect(() => {
    const interval = setInterval(() => {
      setFill((prev) => {
        let value;
        if (prev !== 100) {
          value = prev + 25;
          return value;
        } else {
          return (value = 0);
        }
      });
    }, 2000);

    // Clean up the interval when component unmounts or fill changes
    return () => {
      clearInterval(interval);
    };
  }, [fill]);

  // Render loading screen components
  return (
    <div className="bg-neutral-800 h-full w-full flex justify-center items-center">
      <div className="w-[300px] h-[200px] flex flex-col items-center justify-evenly">
        <div className="text-[40px] duration-300" style={{ transform: `translateY(${position}px)` }}>
          <FaWalkieTalkie />
        </div>
        <div className="h-1.5 w-full bg-neutral-100">
          <div
            className={`h-1.5 bg-neutral-400 duration-300`}
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; // Export the LoadingScreen component
