import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userProfile } from "../../layout/Auth";
import CircleloadingScreen from "../CircleloadingScreen";
import { updateUser } from "../../utils/updateuser";

import { profiles } from "../../ui/sidebar_ui/SidebarHeader";
import { Chats } from "../../context/Appcontext";

// Component for handling logout functionality
const Logout = () => {
  const [loading, setLoading] = useState(false); // State for loading status
  const { logOut, setVerified, user } = useAuth(); // Authentication context

  // Function to handle logout
  const handleLogout = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Update user status to offline
      await updateUser(user.uid, {
        logged_in: false,
        status: "offline",
      });
      // Logout user
      await logOut();
      // Reset state and context variables
      if (!user) {
        setVerified(false);
        userProfile.value = null;
        Chats.value = null;
        profiles.value = null;
      }
    } catch (error) {
      console.log("Failed to sign out: ", error.message);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <>
      {loading ? (
        <CircleloadingScreen /> // Show loading screen if loading is true
      ) : (
        // Render logout button
        <span
          onClick={handleLogout}
          className="text-[14px] text-black px-4 py-2 whitespace-nowrap hover:bg-neutral-300"
        >
          Log out
        </span>
      )}
    </>
  );
};

export default Logout; // Export the Logout component
