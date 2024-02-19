import { collection, getDocs, query, where } from "firebase/firestore";
import { userDb } from "../firebase/Firebase";


const getUsers = async(uidToExclude) => {
    try {
        const userCollectionRef = collection(userDb, "Users");
        const filteredUsers = query(userCollectionRef, where("uid", "!=", uidToExclude))
        const docSnap = await getDocs(filteredUsers);
        const users = [];
        docSnap.forEach((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            users.push(data);
          }
        });
        return users;
    } catch (error) {
       console.log(error.message); 
    }
}


export default getUsers;