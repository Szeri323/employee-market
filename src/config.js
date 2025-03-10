import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAUD9TOeu4sqqUpO9q20VZftq--5N13mc",
    authDomain: "employee-market.firebaseapp.com",
    projectId: "employee-market",
    storageBucket: "employee-market.firebasestorage.app",
    messagingSenderId: "205123514040",
    appId: "1:205123514040:web:4dadc1bdd81ac056790e4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const google_provider = new GoogleAuthProvider()
export const db = getFirestore(app)