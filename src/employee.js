export { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc }
import { collection, doc, setDoc } from "firebase/firestore"
import { clearInputField, clearWitheSpacesInData } from "./custom_functions"

const collectionName = "employees"

const employeeForm = document.getElementById("employee-form")

/* Employee avatar */
const avatarLabelEl = document.getElementById("avatar-label")
const inputFieldAvatarEl = document.getElementById("input-avatar")

/* Employee personal data*/
const inputFieldNameEl = document.getElementById("input-name")
const inputFieldSurnameEl = document.getElementById("input-surname")
const inputFieldBirthDateEl = document.getElementById("input-birth-date")
const inputFieldEmailEl = document.getElementById("input-email")
const inputFieldPhoneNumberEl = document.getElementById("input-phone-number")

/* Employee experience */
const experienceContainer = document.getElementById("experience-container")
const addExperienceBtn = document.getElementById("add-experience-btn")

/* Employee skills */
const inputFieldSkillEl = document.getElementById("input-skill")
const addSkillBtn = document.getElementById("add-skill-btn")
const skillsContainer = document.getElementById("skills-container")

/* Employee links */
const inputFieldLinkEl = document.getElementById("input-link")
const addLinkBtn = document.getElementById("add-link-btn")
const linksContainerEl = document.getElementById("links-container")

// const saveEmployeeDataBtn = document.getElementById("save-employee-data-btn")


/* Event listeners */
inputFieldAvatarEl.addEventListener("change", changeLabelAvatar)
addExperienceBtn.addEventListener("click", addExperienceToExperienceContainer)
addSkillBtn.addEventListener("click", addSkillToSkillsContainer)
addLinkBtn.addEventListener("click", addLinkToLinksContainer)


/* DB operations */
async function addEmployeeDataToDB(db, userId) {
    const employeeRef = collection(db, collectionName)
    const docRef = doc(employeeRef, userId)

    const nameValue = clearWitheSpacesInData(inputFieldNameEl.value)
    const surnameValue = clearWitheSpacesInData(inputFieldSurnameEl.value)
    const birthDateValue = inputFieldBirthDateEl.value
    const emailValue = clearWitheSpacesInData(inputFieldEmailEl.value)
    const phoneNumberValue = clearWitheSpacesInData(inputFieldPhoneNumberEl.value)

    const experienceArray = createArrayFromExperience()
    const skillsArray = createArrayFromSkills()
    const ImageURL = createURLFromImageFile()

    await setDoc(docRef, {
        avatar: ImageURL,
        name: nameValue,
        surname: surnameValue,
        birthDate: birthDateValue,
        email: emailValue,
        phoneNumber: phoneNumberValue,
        experience: experienceArray,
        skills: skillsArray
    })
    console.log("Doc created")
}

/* Form management */

function fulfillFormFromDoc(docSnapData) {
    console.log(docSnapData)

    setAvatarFromDoc(docSnapData["avatar"])






    // inputFieldAvatarEl.files[0] = 
}

function setAvatarFromDoc(avatar) {

    fetch(avatar).then((response) => {
        return response.blob()
    }).then((myBlob) => {
        const imageEl = document.createElement("img")
        const imageSource = URL.createObjectURL(myBlob)
        imageEl.src = imageSource

        avatarLabelEl.textContent = ""
        avatarLabelEl.appendChild(imageEl)
    })

    // const imageEl = document.createElement("img")
    // const imageSource = URL.createObjectURL(avatar)

    // imageEl.src = imageSource

    // avatarLabelEl.textContent = ""
    // avatarLabelEl.appendChild(imageEl)
}


function changeLabelAvatar() {
    const imageEl = document.createElement("img")
    const imageSource = URL.createObjectURL(inputFieldAvatarEl.files[0])

    imageEl.src = imageSource

    avatarLabelEl.textContent = ""
    avatarLabelEl.appendChild(imageEl)
}

function addExperienceToExperienceContainer() {
    const experienceBoxEl = document.createElement("div")

    experienceBoxEl.classList.add("experience")

    const jobTitleInputField = document.createElement("input")
    const companyNameInputField = document.createElement("input")
    const startDateInputField = document.createElement("input")
    const endDateInputField = document.createElement("input")
    const jobDescriptionInputField = document.createElement("input")

    jobTitleInputField.classList.add("input-field")

    companyNameInputField.classList.add("input-field")

    startDateInputField.classList.add("input-field")
    startDateInputField.setAttribute("type", "date")

    endDateInputField.classList.add("input-field")
    endDateInputField.setAttribute("type", "date")

    jobDescriptionInputField.classList.add("input-field")

    experienceBoxEl.appendChild(jobTitleInputField)
    experienceBoxEl.appendChild(companyNameInputField)
    experienceBoxEl.appendChild(startDateInputField)
    experienceBoxEl.appendChild(endDateInputField)
    experienceBoxEl.appendChild(jobDescriptionInputField)

    experienceContainer.appendChild(experienceBoxEl)

}

function addSkillToSkillsContainer() {
    let inputValue = inputFieldSkillEl.value

    if (inputValue) {
        inputValue = clearWitheSpacesInData(inputValue)

        const skillEl = document.createElement("p")

        skillEl.textContent = inputValue

        skillsContainer.appendChild(skillEl)

        clearInputField(inputFieldSkillEl)
    }
}

function addLinkToLinksContainer() {
    const inputValue = inputFieldLinkEl.value

    if (inputValue) {
        const linkEl = document.createElement("a")

        linkEl.href = inputFieldLinkEl.value
        linkEl.textContent = inputFieldLinkEl.value
        linkEl.target = "_blank"

        linksContainerEl.appendChild(linkEl)

        clearInputField(inputFieldLinkEl)
    }
}

/* Custom functions */

function createArrayFromExperience() {
    const experienceArray = document.getElementsByClassName("experience")
    let newExperienceArray = []

    for (let experience of experienceArray) {
        const jobTitle = experience.children[0]
        const companyName = experience.children[1]
        const startDate = experience.children[2]
        const endDate = experience.children[3]
        const jobDescription = experience.children[4]

        newExperienceArray.push({
            "jobTitle": jobTitle.value,
            "companyName": companyName.value,
            "startDate": startDate.value,
            "endDate": endDate.value,
            "jobDescription": jobDescription.value
        })
    }
    return newExperienceArray
}

function createArrayFromSkills() {
    const skillsElsArray = skillsContainer.children
    const skillsArray = []
    for (let el of skillsElsArray) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}

function createURLFromImageFile() {
    console.log(inputFieldAvatarEl.files[0])
    // const ImageURL = URL.createObjectURL(inputFieldAvatarEl.files[0])
    // if (ImageURL) {
    //     return ImageURL
    // }
}

