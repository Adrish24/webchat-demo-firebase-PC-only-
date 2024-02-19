import { useEffect, useState } from "react";
import { profiles } from "../../ui/sidebar_ui/SidebarHeader";

// Define constants for different status types
const online = "online";
const idle = "idle";
const dnb = "dnb";

const ActivityStatus = ({ chat }) => {
  // State to store the target chat's profile
  const [target, setTarget] = useState(null);

  useEffect(() => {
    // Find the profile of the target chat participant
    const targetChat = profiles.value?.find(
      (profile) => profile.phoneNumber === chat.participants[1].displayName
    );

    // Set the target chat profile
    setTarget(targetChat);
  }, [profiles.value]);

  return target?.status === online ? (
    // Render online status indicator
    <div className="w-3 h-3 bg-green-600 rounded-full" />
  ) : target?.status === idle ? (
    // Render idle status indicator
    <div className="w-3 h-3 bg-yellow-600 rounded-full" />
  ) : target?.status === dnb ? (
    // Render do-not-disturb status indicator
    <div className="w-3 h-3 bg-red-600 rounded-full" />
  ) : (
    // Render nothing if status is not defined
    null
  );
};

export default ActivityStatus;
