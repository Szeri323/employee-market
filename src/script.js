import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { getFirestore, collection, doc, getDoc } from "firebase/firestore"
import { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc } from "./employee.js"
import { searchForm, getEmployeeWithParameterFromDB } from "./company.js";

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
const auth = getAuth()
const google_provider = new GoogleAuthProvider()
const db = getFirestore(app)

const collectionName = "employees"

const loggedInUserView = document.getElementById("logged-in-user-view")
const loggedInCompanyView = document.getElementById("logged-in-company-view")
const loggedOutView = document.getElementById("logged-out-view")

const signInWithGoogleBtn = document.getElementById("sign-in-google-btn")
const signOutBtn = document.getElementById("sign-out-btn")
const signOutBtnCompanyView = document.getElementById("company-view-sign-out-btn")

signInWithGoogleBtn.addEventListener("click", logInViaGoogle)
signOutBtn.addEventListener("click", signOutFromApp)
signOutBtnCompanyView.addEventListener("click", signOutFromApp)

/* Auth section */
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDocFromDB(user.uid).then((docSnapData) => {
            fulfillFormFromDoc(docSnapData)
        })
            .catch((error) => {
                console.error(error.message)
            })
        employeeForm.addEventListener("submit", (event) => {
            event.preventDefault()
            addEmployeeDataToDB(db, user.uid)
        })
        showLoggedInUserView()
        // searchForm.addEventListener("submit", (event) => {
        //     event.preventDefault()
        //     getEmployeeWithParameterFromDB(db, collectionName)
        // })
        // showLoggedInCompanyView()
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

async function getDocFromDB(userId) {
    const employeeRef = collection(db, collectionName)
    const docRef = doc(employeeRef, userId)

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    }
    else {
        console.log("Doc does not exists.")
    }
}


/* Custom functions */
function showLoggedInUserView() {
    hideView(loggedOutView)
    hideView(loggedInCompanyView)
    showView(loggedInUserView)
}
function showLoggedInCompanyView() {
    hideView(loggedOutView)
    hideView(loggedInUserView)
    showView(loggedInCompanyView)
}

function showLoggedOutView() {
    hideView(loggedInUserView)
    hideView(loggedInCompanyView)
    showView(loggedOutView)
}

function showView(view) {
    view.style.display = "block"
}

function hideView(view) {
    view.style.display = "none"
}