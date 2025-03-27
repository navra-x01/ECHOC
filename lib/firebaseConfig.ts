import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBwR3cTfBYTi91gTjGF6Zimks5vemTNdgk",
  authDomain: "echoc-e16c2.firebaseapp.com",
  projectId: "echoc-e16c2",
  storageBucket: "echoc-e16c2.firebasestorage.app",
  messagingSenderId: "519206693680",
  appId: "1:519206693680:web:e20839eddf140d3255f6f5",
  measurementId: "G-5E0L2DT8PF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



