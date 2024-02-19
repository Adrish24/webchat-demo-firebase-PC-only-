// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz8TnUWV264Mmfb_eDNFEp8FIXBaWOkp8",
  authDomain: "chat-demo-dev-13510.firebaseapp.com",
  projectId: "chat-demo-dev-13510",
  storageBucket: "chat-demo-dev-13510.appspot.com",
  messagingSenderId: "978114966233",
  appId: "1:978114966233:web:998ab124111587f74f84c8",
  databaseURL: "https://chat-demo-dev-13510-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Firebase_Auth = getAuth(app);
export const userDb = getFirestore(app);
export const chatDb = getDatabase(app);


