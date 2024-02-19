import {  doc, getDoc } from "firebase/firestore";
import { userDb } from "../firebase/Firebase";


const getUser = async(uid) => {
    try {
      const userRef = doc(userDb, "Users", `${uid}`);
        const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data
        
      } else {
        console.log("data not found");
      }
    } catch (error) {
       console.log(error.message); 
    }
}


export default getUser;