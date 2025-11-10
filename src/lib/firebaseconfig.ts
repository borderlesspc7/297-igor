import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnPTDbFVZA9o0rUZi8MdrrFkybwb7Kjqo23",
  authDomain: "goldcury-24db923.firebaseapp.com",
  projectId: "goldcury-24db923",
  storageBucket: "goldcury-24db9.firebasestorage.app23",
  messagingSenderId: "87207212173323",
  appId: "1:872072121733:web:9db7270d4c2a3b951408e23",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export { app };
export default firebaseConfig;
