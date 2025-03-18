export { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc }
import { clearInputField, clearWhiteSpacesInData, validateData, validateEmail, validatePhoneNumber, getAllById, addChange, addClick, addDblClick } from "./custom_functions"


const avatar = {
    label: "avatar-label",
    inputField: "input-avatar"
} as const

type AvatarKeysT = keyof typeof avatar
type AvatarValuesT = typeof avatar[AvatarKeysT]

const personalData = {
    inputFieldName: "input-name",
    inputFieldSurname: "input-surname",
    inputFieldBirthDate: "input-birth-date",
    inputFieldEmail: "input-email",
    inputFieldPhoneNumber: "input-phone-number"
} as const

type PersonalDataKeysT = keyof typeof personalData
type PersonalDataValuesT = typeof personalData[PersonalDataKeysT]

const experience = {
    experienceContainer: "experience-container",
    addExperienceBtn: "add-experience-btn"
} as const

type ExperienceKeysT = keyof typeof experience
type ExperienceValuesT = typeof experience[ExperienceKeysT]

const skills = {
    inputField: "input-skill",
    addBtn: "add-skill-btn",
    container: "skills-container"
} as const

type SkillsKeysT = keyof typeof skills
type SkillsValuesT = typeof skills[SkillsKeysT]

const links = {
    inputField: "input-link",
    addBtn: "add-link-btn",
    container: "links-container"
} as const

type LinksKeysT = keyof typeof links
type LinksValuesT = typeof links[LinksKeysT]

const employeeDomElementIds = {
    errorPreview: "error-preview",
    form: "employee-form",
    avatar,
    personalData,
    experience,
    skills,
    links
} as const


const employeeDOM = getAllById(employeeDomElementIds)

const personalDataNames = ["name", "surname", "birthDate", "email", "phoneNumber"] as const
type personalDataNamesValues = typeof personalDataNames[number]

const experienceDataNames = ["jobTitle", "companyName", "startDate", "endDate", "jobDescription"]

const employeeForm = employeeDOM.form

/* DB operations */
const addEmployeeDataToDB = async (userId: string) => {
    try {
        let ImageURL: unknown;
        const avatar = employeeDOM.avatar.label
        if (avatar) {
            const image = avatar.children[0]
            if (image instanceof HTMLImageElement) {
                ImageURL = image.src
            }
        }
        else {
            ImageURL = await createURLFromImageFile()
        }

        const results: Record<string, any> = {}
        const personalDataVales = employeeDOM.personalData

        Object.keys(personalDataVales).forEach((key, i) => {
            const itemName = personalDataNames[i]
            const value = personalDataVales[key].value
            if (itemName == "email") {
                results[itemName] = validateEmail(value)
            }
            else if (itemName == "birthDate") {
                results[itemName] = value
            }
            else if (itemName == "phoneNumber") {
                results[itemName] = validatePhoneNumber(value)
            }
            else {
                results[itemName] = clearWhiteSpacesInData(value)
            }
        })

        const experienceArray = createArrayFromExperience()
        const skillsArray = createArrayFromSkills()
        const linksArray = createArrayFromLinks()

        const { setDocInDB } = await import("./db_operations")

        setDocInDB(userId, ImageURL, results, experienceArray, skillsArray, linksArray)

        console.log("Doc created")
        employeeDOM.errorPreview.textContent = ""
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            employeeDOM.errorPreview.textContent = error.message
        }
    }
}


/* Filling form form doc */
const fulfillFormFromDoc = (docSnapData: Record<string, any>) => {
    setAvatarFromDocSnapData(docSnapData["avatar"])
    setPersonalDataInputsFromDocSnapData(docSnapData["personalData"])
    setExperienceInputsFromDocSnapData(docSnapData["experience"])
    setSkillFromDocSnapData(docSnapData["skills"])
    setLinksFromDocSnapData(docSnapData["links"])
}

const setAvatarFromDocSnapData = (avatar: string) => {
    const label = employeeDOM["avatar"].label
    const imageEl = document.createElement("img")

    const imageSource = avatar

    imageEl.src = imageSource
    if (label) {
        label.textContent = ""
        label.appendChild(imageEl)
    }
}

const setPersonalDataInputsFromDocSnapData = (personalData: personalDataNamesValues) => {
    const personalDataEl: Record<string, any> = employeeDOM.personalData
    Object.keys(personalDataEl).forEach((key, i) => {
        personalDataEl[key].value = personalData[personalDataNames[i]]
    })
}

const setExperienceInputsFromDocSnapData = (experience: Record<string, any>) => {
    if (!experience) {
        return
    }
    const experienceContainer = employeeDOM.experience.experienceContainer
    if (experienceContainer) {
        for (let i = 1; i < experience.length; i++) {
            addExperienceToExperienceContainer()
        }

        for (let i = 0; i < experienceContainer.children.length; i++) {
            experienceDataNames.forEach((e, j) => {
                experienceContainer.children[i].children[j].value = experience[i][e]
            })
        }
    }
}

const setSkillFromDocSnapData = (skills: string[]) => {
    const skillsContainer = employeeDOM["skills"].container
    if (skillsContainer) {
        for (let el of skills) {
            const skillEl = createEl(el)

            skillsContainer.appendChild(skillEl)
        }
    }
}

const setLinksFromDocSnapData = (links: string[]) => {
    const linksContainer = employeeDOM["links"].container
    if (linksContainer) {
        for (let el of links) {
            const linkContainerEl = createContainerEl(el)

            linksContainer.appendChild(linkContainerEl)
        }
    }
}


/* Form management */
const changeLabelAvatar = async () => {
    const inputField = employeeDOM["avatar"].inputField
    const label = employeeDOM["avatar"].label

    const imageEl = document.createElement("img")

    const imageSource = await getBase64Image(inputField.files[0])

    imageEl.src = imageSource as string

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
    let newExperienceArray: {}[] = []

    for (let experience of experienceArray) {
        const results = {}
        experienceDataNames.forEach((name, i) => {
            results[name] = name == "startDate" || name == "endDate" ? experience.children[i]["value"] : clearWhiteSpacesInData(experience.children[i]["value"])
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
    const skillsArray: string[] = []
    for (let el of skillElsArray) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}

const createArrayFromLinks = () => {
    const linkElsArray = employeeDOM.links.container.children
    const linksArray: string[] = []
    for (let el of linkElsArray) {
        linksArray.push(el.textContent)
    }
    return linksArray
}

const createURLFromImageFile = async () => {
    const input = employeeDOM.avatar.inputField
    const ImageURL = await getBase64Image(input.files[0])
    if (ImageURL) {
        return ImageURL
    }
}

const createEl = (value) => {
    const el = document.createElement("p")

    el.textContent = value

    addDblClick(el, (event) => {
        const target = event?.target
        // target?.remove()
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
        // event.target.parentElement.remove()
    })

    linkContainer.appendChild(linkEl)
    linkContainer.appendChild(deleteLinkBtn)
    return linkContainer
}

const getBase64Image = (file) => {
    return new Promise((resolve) => {
        convertFileToBase64(file, resolve)
    })
}

const convertFileToBase64 = (file, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        callback(reader.result)
    }
}

/* Event listeners */
addChange(employeeDOM.avatar.inputField, changeLabelAvatar)
addClick(employeeDOM.experience.addExperienceBtn, addExperienceToExperienceContainer)
addClick(employeeDOM.skills.addBtn, addElementToContainer.bind(null, employeeDOM["skills"], false))
addClick(employeeDOM.links.addBtn, addElementToContainer.bind(null, employeeDOM["links"], true))
