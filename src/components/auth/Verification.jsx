import {  useState } from "react";
import { useAuth } from "../../context/AuthContext";
import saveUser from "../../utils/saveUser";
import getUser from "../../utils/getUser";
import CircleloadingScreen from "../CircleloadingScreen";
import { userProfile } from "../../layout/Auth";
import { updateUser } from "../../utils/updateuser";
import { Chats } from "../../context/Appcontext";
import { serverTimestamp } from "firebase/firestore";

// Component for user verification
const Verification = () => {
  const [inputValue, setInputValue] = useState(""); // State for verification code input value
  const [loading, setLoading] = useState(false); // State to indicate loading state

  // Destructuring properties from useAuth hook
  const { verifyCode, setVerified, setSubmited } = useAuth();

  // Function to handle input change in verification code input field
  const handleInputChange = (e) => {
    // Replace non-numeric characters with an empty string
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    // Limit the length to 6 digits
    const oneDigitValue = sanitizedValue.slice(0, 6);
    setInputValue(oneDigitValue); // Update input value state
  };

  // Function to handle verification code submission
  const handleVerifyCode = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Verify the entered verification code
      const result = await verifyCode(inputValue);
      if (result) {
        userProfile.value = await getUser(result.user.uid);
        if (userProfile.value) {
          // Update user status and last logged-in time
          await updateUser(result.user.uid, {
            logged_in: true,
            lastLogged_in: serverTimestamp(),
            status: "online",
          });
          setVerified(true); // Set user as verified
          Chats.value = userProfile.value.chats; // Update chats context with user's chats
        } else {
          // Save new user's data if user profile doesn't exist
          await saveUser(result.user);
          userProfile.value = await getUser(result.user.uid);
          if (userProfile.value) {
            setVerified(true); // Set user as verified
            Chats.value = userProfile.value.chats; // Update chats context with user's chats
          }
        }
      }
    } catch (error) {
      console.log(error.message); // Log any errors during verification process
    } finally {
      setVerified(true); // Set user as verified
      setSubmited(false); // Reset submission status
      setLoading(false); // Set loading state to false
    }
  };

  // Render the verification form or loading screen based on loading state
  return (
    <>
      {loading ? (
        <CircleloadingScreen /> // Render loading screen while verifying
      ) : (
        <div className="bg-neutral-900 m-auto w-[300px] p-8 rounded-md flex flex-col">
          <div className="flex gap-2">
            <span className="bg-neutral-400 px-2 py-1 rounded-sm mb-4 w-full">
              <input
                type="text"
                value={inputValue}
                className="w-full bg-transparent  placeholder:text-neutral-900 border-none outline-none"
                onInput={handleInputChange}
              />
            </span>
          </div>
          <button
            type="submit"
            className="bg-neutral-300 px-2 py-1 rounded-md"
            onClick={handleVerifyCode}
          >
            Verify
          </button>
        </div>
      )}
    </>
  );
};

export default Verification; // Export the Verification component
