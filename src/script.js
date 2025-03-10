import { auth, google_provider } from "./config.js";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc } from "./employee.js"
import { getSkillsFromDB } from "./company.js";
import { addClick, addSubmit } from "./custom_functions.js";

const loggedInUserView = document.getElementById("logged-in-user-view")
const loggedInCompanyView = document.getElementById("logged-in-company-view")
const loggedOutView = document.getElementById("logged-out-view")

const signInWithGoogleBtn = document.getElementById("sign-in-google-btn")
const signOutBtn = document.getElementById("sign-out-btn")
const signOutBtnCompanyView = document.getElementById("company-view-sign-out-btn")


/* Auth section */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const { getDocFromDB } = await import("./db_operations.js")
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
        // getSkillsFromDB()
        // showLoggedInCompanyView()
    }
    else {
        showLoggedOutView()
    }
})

const signOutFromApp = () => {
    signOut(auth)
        .then(() => {
        })
        .catch((error) => {
            console.error(error.message)
        })
}

const logInViaGoogle = () => {
    signInWithPopup(auth, google_provider)
        .then(() => {
        })
        .catch((error) => {
            console.error(error.message)
        })
}


/* Custom functions */
const showLoggedInUserView = () => {
    hideView(loggedOutView)
    hideView(loggedInCompanyView)
    showView(loggedInUserView)
}
const showLoggedInCompanyView = () => {
    hideView(loggedOutView)
    hideView(loggedInUserView)
    showView(loggedInCompanyView)
}

const showLoggedOutView = () => {
    hideView(loggedInUserView)
    hideView(loggedInCompanyView)
    showView(loggedOutView)
}

const showView = (view) => {
    view.style.display = "block"
}

const hideView = (view) => {
    view.style.display = "none"
}


/* Event Listeners */
addClick(signInWithGoogleBtn, logInViaGoogle)
addClick(signOutBtn, signOutFromApp)
addClick(signOutBtnCompanyView, signOutFromApp)