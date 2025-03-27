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



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBwR3cTfBYTi91gTjGF6Zimks5vemTNdgk",
//   authDomain: "echoc-e16c2.firebaseapp.com",
//   projectId: "echoc-e16c2",
//   storageBucket: "echoc-e16c2.firebasestorage.app",
//   messagingSenderId: "519206693680",
//   appId: "1:519206693680:web:e20839eddf140d3255f6f5",
//   measurementId: "G-5E0L2DT8PF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);