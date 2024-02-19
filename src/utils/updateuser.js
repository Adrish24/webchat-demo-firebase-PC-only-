import { doc, updateDoc } from "firebase/firestore";
import { chatDb, userDb } from "../firebase/Firebase";
import { push, ref, remove, serverTimestamp, update } from "firebase/database";





export const updateUser = async (uid, values) => {
  try {
    if(!uid) return;
    const userRef = doc(userDb, "Users", `${uid}`);
    await updateDoc(userRef, values);
  } catch (error) {
    console.log(error);
  }
};

export const updateTargetUser = async (uid, values) => {
  try {
    if(!uid) return;
    const userRef = doc(userDb, "Users", `${uid}`);
    await updateDoc(userRef, values);
  } catch (error) {
    console.log(error.message);
  }
};


export class Message {
  constructor(message, name, date) {
    this.message = message;
    this.name = name;
    this.date = date;
  }

  calculateExpireDate (date){
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + date);
  
    return expirationTime.toString();
  }

  createMessage() {
    return {
      name: this.name,
      message: this.message,
      sent_time: serverTimestamp(),
      seen: false,
      expirationTime: this.calculateExpireDate(this.date)
    };
  }
}

export const updateRoom = async (roomId, values) => {
  try {
    const roomRef = ref(chatDb, `rooms/${roomId}`);

    // Use push to generate a unique key and set the new message
    await push(roomRef, values);
  } catch (error) {
    console.log(error.messgae);
  }
};

export const updateMessage = async(roomId, msgId, values) => {
  try{
    const messageRef = ref(chatDb,`rooms/${roomId}/${msgId}`)

    await update(messageRef, values)
  }catch(err){
    console.log(err)
  }
}

export const updateMessageDelete = async(roomId, msgId, values) => {
  try{
    const messageRef = ref(chatDb,`rooms/${roomId}/${msgId}/deleteFor`)

    await update(messageRef, values)
  }catch(err){
    console.log(err)
  }
}

export const restoreMessage = async(roomId, msgId) => {
  try {
    const messageRef = ref(chatDb,`rooms/${roomId}/${msgId}/deleteFor`)

    await remove(messageRef)
  } catch (error) {
    console.log(error)
  }
}

export const updateReactions = async (roomId, msgId,values) => {
  try {
    const reactionRef = ref(
      chatDb,
      `rooms/${roomId}/${msgId}/reaction/`
    );

    await push(reactionRef, values);
  } catch (error) {
    console.log(error.messgae);
  }
};


export const removeReaction = async (roomId, msgId,reactId) => {
  try {
    const reactionRef = ref(chatDb, `rooms/${roomId}/${msgId}/reaction/${reactId}`);

    await remove(reactionRef);
  } catch (error) {
    console.log(error.message);
  }
};
