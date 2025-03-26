import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Sign up function
export const signUp = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required!");

  try {
    console.log("Attempting signup with:", email, password);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Signup successful:", userCredential.user);

    return userCredential.user;
  } catch (error: unknown) {
    console.error("Signup Error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);  // Extract the Firebase error message
    } else {
      throw new Error("An unknown error occurred during signup");
    }
  }
};


// Login function
export const login = async (email: string, password: string) => {
  try {
    console.log("login fn");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return userCredential.user;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
