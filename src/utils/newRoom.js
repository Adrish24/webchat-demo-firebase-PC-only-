import { get, ref, serverTimestamp, set } from "firebase/database";
import { chatDb } from "../firebase/Firebase";


const newRoom = async (roomId) => {
  try { 

    const roomRef = ref(chatDb, `rooms/${roomId}`);


    const snapshot2 = await get(roomRef);
    const existingRooom = snapshot2.val();

    if (existingRooom) {
      return;
    }

    await set(roomRef, {  
     "-NewRoomCreated": {
      firstMessage: "Your are Connected",
      timeStamp: serverTimestamp(),
     }
    });

  } catch (error) {
    console.log(error.message);
  }
};

export default newRoom;
