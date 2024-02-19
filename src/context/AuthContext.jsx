import { createContext, useContext, useEffect, useState } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { Firebase_Auth, userDb } from "../firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";

// Create a context for user authentication
const UserContext = createContext();

// Global variable to hold the confirmation result of phone number verification
let confirmationResult = null;

// Authentication context provider component
export const AuthContextProvider = ({ children }) => {
  // State variables for user authentication and verification status
  const [user, setUser] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [verified, setVerified] = useState(false);
  const [alreadyLoggedInStatus, setAlreadyLoggedInStatus] = useState({
    logged_in: false,
    username: null,
  });

  // Firebase authentication instance
  const auth = Firebase_Auth;

  // Effect hook to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup function to unsubscribe from authentication state changes
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to log in with phone number using Firebase authentication
  const logIn = (auth, phoneNumber, recaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  // Function to send verification code to a phone number
  const sendCode = async (phoneNumber) => {
    let recaptchaVerifier;

    try {
      const collectionRef = collection(userDb, "Users");
      const snapshot = await getDocs(collectionRef);

      const findUser = snapshot.docs.find(
        (doc) => doc.data().phoneNumber === phoneNumber
      );

      if (findUser?.exists() && findUser?.data()?.logged_in) {
        setAlreadyLoggedInStatus({
          logged_in: true,
          username: phoneNumber,
        });
        return;
      }

      // Initialize reCAPTCHA verifier
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      // Log in with phone number and reCAPTCHA verifier
      confirmationResult = await logIn(auth, phoneNumber, recaptchaVerifier);
      if (confirmationResult) {
        setSubmited(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      // Clear reCAPTCHA verifier after usage
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }
    }
  };

  // Function to verify verification code sent to the phone number
  const verifyCode = (verificationCode) => {
    return confirmationResult.confirm(verificationCode);
  };

  // Function to log out the current user
  const logOut = () => {
    return signOut(auth);
  };

  // Provide authentication context values to child components
  return (
    <UserContext.Provider
      value={{
        user,
        logOut,
        logIn,
        sendCode,
        verifyCode,
        submited,
        verified,
        setVerified,
        setSubmited,
        alreadyLoggedInStatus,
        setAlreadyLoggedInStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access authentication context values
export const useAuth = () => {
  return useContext(UserContext);
};
