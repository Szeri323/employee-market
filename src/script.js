// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAUD9TOeu4sqqUpO9q20VZftq--5N13mc",
    authDomain: "employee-market.firebaseapp.com",
    projectId: "employee-market",
    storageBucket: "employee-market.firebasestorage.app",
    messagingSenderId: "205123514040",
    appId: "1:205123514040:web:4dadc1bdd81ac056790e4d"
};


const loggedInView = document.getElementById("logged-in-view")
const loggedOutView = document.getElementById("logged-out-view")

const signInWithGoogleBtn = document.getElementById("sign-in-google-btn")
const signOutBtn = document.getElementById("sign-out-btn")

signInWithGoogleBtn.addEventListener("click", logInViaGoogle)
signOutBtn.addEventListener("click", signOutFromApp)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()

const google_provider = new GoogleAuthProvider()

/* Auth section */

onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView()
    }
    else {
        showLoggedOutView()
    }
})

function signOutFromApp() {
    signOut(auth)
        .then(() => {
        })
        .catch((error) => {
            console.error(error.message)
        })
}

function logInViaGoogle() {
    signInWithPopup(auth, google_provider)
        .then(() => {
        })
        .catch((error) => {
            console.error(error.message)
        })
}




/* Custom functions */

function showLoggedInView() {
    hideView(loggedOutView)
    showView(loggedInView)
}

function showLoggedOutView() {
    hideView(loggedInView)
    showView(loggedOutView)
}

function showView(view) {
    view.style.display = "block"
}

function hideView(view) {
    view.style.display = "none"
}