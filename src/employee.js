export { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc }
import { collection, doc, setDoc } from "firebase/firestore"
import { clearInputField, clearWhiteSpacesInData, getAllById, addChange, addClick, addDblClick } from "./custom_functions"

const collectionName = "employees"

const employeeDomElementIds = {
    form: "employee-form",
    avatar: {
        label: "avatar-label",
        inputField: "input-avatar"
    },
    personalData: {
        inputFieldName: "input-name",
        inputFieldSurname: "input-surname",
        inputFieldBirthDate: "input-birth-date",
        inputFieldEmail: "input-email",
        inputFieldPhoneNumber: "input-phone-number"
    },
    experience: {
        experienceContainer: "experience-container",
        addExperienceBtn: "add-experience-btn"
    },
    skills: {
        inputField: "input-skill",
        addBtn: "add-skill-btn",
        container: "skills-container"
    },
    links: {
        inputField: "input-link",
        addBtn: "add-link-btn",
        container: "links-container"
    }
}

const employeeDOM = getAllById(employeeDomElementIds)

const personalDataNames = ["name", "surname", "birthDate", "email", "phoneNumber"]
const experienceDataNames = ["jobTitle", "companyName", "startDate", "endDate", "jobDescription"]

const employeeForm = employeeDOM.form

/* DB operations */
const addEmployeeDataToDB = async (db, userId) => {
    try {
        const employeeRef = collection(db, collectionName)
        const docRef = doc(employeeRef, userId)

        const ImageURL = createURLFromImageFile()

        const results = {}
        const personalData = employeeDOM.personalData

        Object.keys(personalData).forEach((key, i) => {
            const itemName = personalDataNames[i]
            const value = personalData[key].value
            results[itemName] = itemName == "birthDate" ? value : clearWhiteSpacesInData(value)
        })

        const experienceArray = createArrayFromExperience()
        const skillsArray = createArrayFromSkills()
        const linksArray = createArrayFromLinks()

        await setDoc(docRef, {
            avatar: ImageURL,
            personalData: results,
            experience: experienceArray,
            skills: skillsArray,
            links: linksArray
        })
        console.log("Doc created")
    }
    catch (error) {
        console.error(error.message)
    }
}


/* Filling form form doc */
const fulfillFormFromDoc = (docSnapData) => {
    setAvatarFromDocSnapData(docSnapData["avatar"])
    setPersonalDataInputsFromDocSnapData(docSnapData["personalData"])
    setExperienceInputsFromDocSnapData(docSnapData["experience"])
    setSkillFromDocSnapData(docSnapData["skills"])
    setLinksFromDocSnapData(docSnapData["links"])
}

const setAvatarFromDocSnapData = (avatar) => {
    const label = employeeDOM.avatar.label
    const imageEl = document.createElement("img")
    const imageSource = avatar.replace("blob:", "")

    imageEl.src = imageSource

    label.textContent = ""
    label.appendChild(imageEl)
}

const setPersonalDataInputsFromDocSnapData = (personalData) => {
    const personalDataEl = employeeDOM.personalData
    Object.keys(personalDataEl).forEach((key, i) => {
        personalDataEl[key].value = personalData[personalDataNames[i]]
    })
}

const setExperienceInputsFromDocSnapData = (experience) => {
    if (!experience) {
        return
    }
    const experienceContainer = employeeDOM.experience.experienceContainer

    for (let i = 1; i < experience.length; i++) {
        addExperienceToExperienceContainer()
    }

    for (let i = 0; i < experienceContainer.children.length; i++) {
        experienceDataNames.forEach((e, j) => {
            experienceContainer.children[i].children[j].value = experience[i][e]
        })
    }
}

const setSkillFromDocSnapData = (skills) => {
    const skillsContainer = employeeDOM.skills.container

    for (let el of skills) {
        const skillEl = createEl(el)

        skillsContainer.appendChild(skillEl)
    }
}

const setLinksFromDocSnapData = (links) => {
    const linksContainer = employeeDOM.links.container

    for (let el of links) {
        const linkContainerEl = createContainerEl(el)

        linksContainer.appendChild(linkContainerEl)
    }
}


/* Form management */
const changeLabelAvatar = () => {
    const inputField = employeeDOM.avatar.inputField
    const label = employeeDOM.avatar.label

    const imageEl = document.createElement("img")
    const imageSource = URL.createObjectURL(inputField.files[0])

    imageEl.src = imageSource

    label.textContent = ""
    label.appendChild(imageEl)
}

const addExperienceToExperienceContainer = () => {
    const experienceContainer = employeeDOM.experience.experienceContainer
    const experienceBoxEl = document.createElement("div")

    experienceBoxEl.classList.add("experience")

    experienceDataNames.forEach((name) => {
        const input = document.createElement("input")
        input.classList.add("input-field")
        if (name == "startDate" || name == "endDate") {
            input.setAttribute("type", "date")
        }
        experienceBoxEl.appendChild(input)
    })

    experienceContainer.appendChild(experienceBoxEl)
}

const addElementToContainer = (obj, isContainer) => {
    /*
        isContainer checks if element is skillEL or linksContainer
    */
    const input = obj.inputField
    const container = obj.container
    let inputValue = input.value

    if (inputValue) {
        inputValue = validateData(inputValue)

        let el = new Object()
        if (isContainer) {
            el = createContainerEl(inputValue)
        }
        else {
            el = createEl(inputValue)
        }
        container.appendChild(el)

        clearInputField(input)
    }
}


/* Custom consts */
const createArrayFromExperience = () => {
    const experienceArray = document.getElementsByClassName("experience")
    let newExperienceArray = []

    for (let experience of experienceArray) {
        const results = {}
        experienceDataNames.forEach((name, i) => {
            console.log(experience.children[i].value)
            results[name] = experience.children[i].value
        })
        if (results["endDate"] < results["startDate"]) {
            throw new Error("End date is earlier than start date.")
        }
        newExperienceArray.push(results)
    }
    return newExperienceArray
}

const createArrayFromSkills = () => {
    const skillElsArray = employeeDOM.skills.container.children
    const skillsArray = []
    for (let el of skillElsArray) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}

const createArrayFromLinks = () => {
    const linkElsArray = employeeDOM.links.container.children
    const linksArray = []
    for (let el of linkElsArray) {
        linksArray.push(el.textContent)
    }
    return linksArray
}

const createURLFromImageFile = () => {
    const input = employeeDOM.avatar.inputField
    // console.log(inputFieldAvatarEl.files[0])
    const ImageURL = URL.createObjectURL(input.files[0])
    if (ImageURL) {
        return ImageURL
    }
}

const createEl = (value) => {
    const el = document.createElement("p")

    el.textContent = value

    addDblClick(el, (event) => {
        event.target.remove()
    })

    return el
}

const createContainerEl = (value) => {
    const linkContainer = document.createElement("div")
    const linkEl = document.createElement("a")
    const deleteLinkBtn = document.createElement("input")

    linkContainer.classList.add("link-container")

    linkEl.href = value
    linkEl.textContent = value
    linkEl.target = "_blank"

    deleteLinkBtn.classList.add("btn")
    deleteLinkBtn.classList.add("btn-delete")
    deleteLinkBtn.type = "button"
    deleteLinkBtn.value = "X"

    addDblClick(deleteLinkBtn, (event) => {
        event.target.parentElement.remove()
    })

    linkContainer.appendChild(linkEl)
    linkContainer.appendChild(deleteLinkBtn)
    return linkContainer
}

const validateData = (data) => {
    data = clearWhiteSpacesInData(data)
    data = data.toLowerCase()
    let newData = ""
    for (let char of data){
        if (char != " ") {
            newData += char
        }
    }
    return newData
}

/* Event listeners */
addChange(employeeDOM.avatar.inputField, changeLabelAvatar)
addClick(employeeDOM.experience.addExperienceBtn, addExperienceToExperienceContainer)
addClick(employeeDOM.skills.addBtn, addElementToContainer.bind(null, employeeDOM.skills, false))
addClick(employeeDOM.links.addBtn, addElementToContainer.bind(null, employeeDOM.links, true))
