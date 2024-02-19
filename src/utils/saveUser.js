import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { userDb } from "../firebase/Firebase";

const saveUser = async (user) => {
  try {
    const userCollectionRef = collection(userDb, "Users");

    await setDoc(doc(userCollectionRef, `${user.uid}`), {
      displayName: "",
      email: "",
      phoneNumber: user.phoneNumber,
      uid: user.uid,
      logged_in: true,
      lastLogged_in: serverTimestamp(),
      chats: [],
      status:"online",
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default saveUser;
