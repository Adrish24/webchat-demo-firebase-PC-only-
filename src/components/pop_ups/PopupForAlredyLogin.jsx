import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { userDb } from "../../firebase/Firebase";
import { updateUser } from "../../utils/updateuser";

const PopupForAlredyLogin = () => {
  const { alreadyLoggedInStatus, setAlreadyLoggedInStatus } = useAuth();

  // Function to sign out the user
  const signOut = async () => {
    try {
      const collectionRef = collection(userDb, "Users");
      const snapshot = await getDocs(collectionRef);

      const findUser = snapshot.docs.find(
        (doc) => doc.data().phoneNumber === alreadyLoggedInStatus.username
      );

      if (findUser.exists() && findUser.data()?.logged_in) {
        await updateUser(findUser.data()?.uid, { logged_in: false });
      }
    } catch (err) {
      console.log(err);
    } finally {
      // Reset already logged in status
      setAlreadyLoggedInStatus({
        logged_in: false,
        username: null,
      });
    }
  };

  return (
    <div className="absolute top-0 left-0 z-50 h-screen w-full flex justify-center py-4">
      <div className="mx-auto mb-auto flex flex-col rounded-lg bg-neutral-950 text-neutral-50 border-2 border-neutral-400">
        <div className="px-10 py-5">
          The user is already logged in on another device.
        </div>
        <div className="flex justify-center py-5">
          {/* Button to sign out */}
          <button className="px-4 py-2 bg-red-600 rounded-full mr-5 font-medium" onClick={signOut}>
            Sign out
          </button>
          {/* Button to close the popup */}
          <button className="px-4 py-2 bg-sky-600 rounded-full font-medium" onClick={() => setAlreadyLoggedInStatus({ logged_in: false, username: null })}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupForAlredyLogin;
