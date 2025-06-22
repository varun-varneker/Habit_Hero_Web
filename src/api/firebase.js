import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBuj0jZtJSKZyAG_4tn7A2O63VXXdK-D_A',
  authDomain: 'habit-maker-3195e.firebaseapp.com',
  projectId: 'habit-maker-3195e',
  storageBucket: 'habit-maker-3195e.firebasestorage.app',
  messagingSenderId: '341215315958',
  appId: 'G-VL9CESWYQM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);