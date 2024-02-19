import { BiFilter, BiSearchAlt2 } from "react-icons/bi";

const SearchBar = () => {
  return (
    <div className="flex p-3 h-[50px] items-center bg-neutral-300 z-[10]">
      <div className="grow flex bg-neutral-50 rounded-md pl-16 pr-8 items-center h-[35px] relative">
        <span className="absolute left-[24px] cursor-pointer text-neutral-500 placeholder:text-neutral-500">
          <BiSearchAlt2 />
        </span>
        <input type="text" className="grow bg-transparent border-none outline-none text-neutral-950" placeholder="Search or start new chart" />
      </div>
      <span className="text-[24px] mx-2 cursor-pointer">
        <BiFilter />
      </span>
    </div>
  );
};

export default SearchBar;
