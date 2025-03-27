import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig"; // Firestore instance

// Sign up function
export const signUp = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required!");

  try {
    console.log("Attempting signup with:", email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signup successful:", user.uid);

    // Check if the user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Store user data in Firestore
      await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
        balance: 0, // Initial balance
        portfolio: [], // Empty portfolio initially
      });
      console.log("User data saved in Firestore");
    }

    return user;
  } catch (error: unknown) {
    console.error("Signup Error:", error);

    if (error instanceof Error) {
      throw new Error(error.message); // Extract Firebase error message
    } else {
      throw new Error("An unknown error occurred during signup");
    }
  }
};
