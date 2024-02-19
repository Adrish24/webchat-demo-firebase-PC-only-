import { get, onValue, ref } from "firebase/database";
import { chatDb, userDb } from "../firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";

export const retriveChats = async (uid) => {
  const chatRef = doc(userDb, "Users", `${uid}`);
  try {
    const docSnap = await getDoc(chatRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const retriveRoom = async (roomId) => {
  try {
    const roomRef = ref(chatDb, `rooms/${roomId}`);
    let data
    onValue(roomRef, (snapshot) => {
      data = snapshot.val();
    })

    if(data){
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const retriveLastMessage = async(roomId) => {
  try {
    const roomRef = ref(chatDb, `rooms/${roomId}`);
    let data
    onValue(roomRef, (snapshot) => {
      data = snapshot.val();
    })

    if(data){
      const tempArray = Object.entries(data).map(([key, value]) => ({ msgId: key, ...value })).reverse();
        // console.log(tempArray)
      return tempArray[0];
    }
  } catch (error) {
    console.log(error.message);
  }
}
