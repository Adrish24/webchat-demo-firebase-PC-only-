import SidebarHeader, { profiles } from "../ui/sidebar_ui/SidebarHeader";
import SidebarFooter from "../ui/sidebar_ui/SidebarFooter";
import Sidebarbox from "../components/sidebar/Sidebarbox";
import SearchBar from "../components/sidebar/search/SearchBar";

import { useEffect } from "react";
import getUsers from "../utils/getUsers";
import { userProfile } from "./Auth";

import Newchat from "../components/sidebar/Newchat";
import { Chats } from "../context/Appcontext";

// Component for rendering the sidebar
const Sidebar = () => {
  // Effect to retrieve user profiles
  useEffect(() => {
    const retrieveProfiles = async () => {
      // Check if user profile exists and has a UID
      if (userProfile.value && userProfile.value.uid) {
        profiles.value = await getUsers(userProfile.value.uid); // Retrieve user profiles
      }
    };

    retrieveProfiles(); // Invoke the function to retrieve profiles
  }, [profiles.value]); // Dependency array for useEffect

  // Render the sidebar components if Chats.value exists
  return (
    <div className="w-[35%] flex flex-col relative">
      {Chats.value ? (
        <>
          <Newchat /> {/* Render the Newchat component */}
          <SidebarHeader /> {/* Render the SidebarHeader component */}
          <SearchBar /> {/* Render the SearchBar component */}
          <Sidebarbox /> {/* Render the Sidebarbox component */}
          <SidebarFooter /> {/* Render the SidebarFooter component */}
        </>
      ) : null}
    </div>
  );
};

export default Sidebar; // Export the Sidebar component
