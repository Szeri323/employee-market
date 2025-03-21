export { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc }
import { DocumentData } from "firebase/firestore"
import { clearInputField, clearWhiteSpacesInData, validateData, validateEmail, validatePhoneNumber, getAllById, addChange, addClick, addDblClick, RecursiveHTMLElement } from "./custom_functions"


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

const experienceDataNames = ["jobTitle", "companyName", "startDate", "endDate", "jobDescription"] as const
type experienceDataNamesValues = typeof experienceDataNames[number]

const employeeForm = employeeDOM.form


/* DB operations */
const addEmployeeDataToDB = async (userId: string) => {
    const errorPreview = employeeDOM.errorPreview
    try {
        const avatar = employeeDOM.avatar.label
        let ImageURL: string | undefined
        if (avatar) {
            const image = avatar.children[0]
            if (image instanceof HTMLImageElement && image.src != "") {
                ImageURL = image.src
            }
            else {
                ImageURL = await createURLFromImageFile()
            }
        }

        if (typeof ImageURL === "undefined") {
            throw new Error("Nie udało się utworzyć linku do avatara")
        }

        const results: Record<string, any> = {}
        const personalDataValues = employeeDOM.personalData

        Object.keys(personalDataValues).forEach((key, i) => {
            const itemName = personalDataNames[i]
            const inputEl = personalDataValues[key as PersonalDataKeysT]
            if (inputEl instanceof HTMLInputElement) {
                const value: string | number = inputEl.value
                if (typeof value == "string") {
                    if (itemName == "email") {
                        results[itemName] = validateEmail(value)
                    }
                    else if (itemName == "birthDate") {
                        results[itemName] = value
                    }
                    else {
                        results[itemName] = clearWhiteSpacesInData(value)
                    }
                }
                else {
                    if (itemName == "phoneNumber") {
                        results[itemName] = validatePhoneNumber(value)
                    }
                }

            }

        })

        const experienceArray = createArrayFromExperience()
        const skillsArray = createArrayFromSkills()
        const linksArray = createArrayFromLinks()

        const { setDocInDB } = await import("./db_operations")

        setDocInDB(userId, ImageURL, results, experienceArray, skillsArray, linksArray)

        console.log("Doc created")
        if (errorPreview) {
            errorPreview.textContent = ""
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            if (errorPreview) {
                errorPreview.textContent = error.message
            }
        }
    }
}


/* Filling form form doc */
const fulfillFormFromDoc = (docSnapData: DocumentData) => {
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

const setPersonalDataInputsFromDocSnapData = (personalDataDict: Record<string, any>) => {
    const personalDataEl: RecursiveHTMLElement<typeof personalData> = employeeDOM.personalData
    Object.keys(personalDataEl).forEach((key, i) => {
        const itemName = personalDataNames[i]
        const inputEl = personalDataEl[key as PersonalDataKeysT]
        if (inputEl instanceof HTMLInputElement) {
            inputEl.value = personalDataDict[itemName]
        }
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
                const experienceItem = experienceContainer.children[i].children[j]
                if (experienceItem instanceof HTMLInputElement || experienceItem instanceof HTMLTextAreaElement) {
                    experienceItem.value = experience[i][e]
                }
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
    if (inputField instanceof HTMLInputElement) {
        const inputFiles = inputField?.files
        if (inputFiles) {
            const imageSource = await getBase64Image(inputFiles[0])
            imageEl.src = imageSource as string
            if (label) {
                label.textContent = ""
                label.appendChild(imageEl)
            }
        }
    }
}

const addExperienceToExperienceContainer = () => {
    const experienceContainer = employeeDOM.experience.experienceContainer
    const experienceBoxEl = document.createElement("div")

    experienceBoxEl.classList.add("experience")

    experienceDataNames.forEach((name) => {
        if (name == "jobDescription") {
            const textarea = document.createElement("textarea")
            textarea.classList.add("input-field")
            textarea.classList.add("input-field-description")
            experienceBoxEl.appendChild(textarea)
        }
        else {
            const input = document.createElement("input")
            input.classList.add("input-field")
            if (name == "startDate" || name == "endDate") {
                input.setAttribute("type", "date")
            }
            experienceBoxEl.appendChild(input)
        }
    })
    if (experienceContainer) {
        experienceContainer.appendChild(experienceBoxEl)
    }
}

const addElementToContainer = (obj: typeof employeeDOM.skills | typeof employeeDOM.links, isContainer: boolean) => {
    /*
        isContainer checks if element is skillEL or linksContainer
    */
    const input = obj.inputField
    const container = obj.container
    if (input instanceof HTMLInputElement) {
        let inputValue = input.value
        if (inputValue) {
            inputValue = validateData(inputValue)

            let el: HTMLDivElement | HTMLParagraphElement
            if (isContainer) {
                el = createContainerEl(inputValue)
            }
            else {
                el = createEl(inputValue)
            }
            container?.appendChild(el)

            clearInputField(input)
        }
    }
}


/* Custom consts */
const createArrayFromExperience = () => {
    const experienceArray = Array.from(document.getElementsByClassName("experience"))
    let newExperienceArray: {}[] = []

    for (let experience of experienceArray) {
        const results: Record<string, string> = {}

        experienceDataNames.forEach((name, i) => {
            const el = experience.children[i]
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                if (el.value == "") {
                    return
                }
                results[name] = name == "startDate" || name == "endDate" ? el.value : clearWhiteSpacesInData(el.value)
            }
        })
        if (results["endDate"] < results["startDate"]) {
            throw new Error("End date is earlier than start date.")
        }
        if (Object.keys(results).length != 0) {
            newExperienceArray.push(results)
        }
    }
    return newExperienceArray
}

const createArrayFromSkills = () => {
    const skillElsArray = Array.prototype.slice.call(employeeDOM.skills.container?.children)
    const skillsArray: string[] = []
    for (let el of skillElsArray) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}

const createArrayFromLinks = () => {
    const linkElsArray = Array.prototype.slice.call(employeeDOM.links.container?.children)
    const linksArray: string[] = []
    for (let el of linkElsArray) {
        linksArray.push(el.textContent)
    }
    return linksArray
}

const createURLFromImageFile = async () => {
    const input = employeeDOM.avatar.inputField
    if (input instanceof HTMLInputElement && typeof input.files != null) {
        let ImageURL: string
        const inputFile = input.files
        if (inputFile) {
            ImageURL = await getBase64Image(inputFile[0])
            return ImageURL
        }
    }
}

const createEl = (value: string) => {
    const el = document.createElement("p")

    el.textContent = value

    addDblClick(el, (event) => {
        const e = event?.target as HTMLElement
        if (e) {
            e.parentElement?.remove()
        }
    })

    return el
}

const createContainerEl = (value: string) => {
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
        const e = event?.target as HTMLElement
        if (e) {
            e.parentElement?.remove()
        }
    })

    linkContainer.appendChild(linkEl)
    linkContainer.appendChild(deleteLinkBtn)
    return linkContainer
}

const getBase64Image = (file: Blob): Promise<string> => {
    return new Promise((resolve) => {
        convertFileToBase64(file, resolve)
    })
}

const convertFileToBase64 = (file: Blob, callback: (s: string) => void): void => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        callback(reader.result as string)
    }
}

/* Event listeners */
addChange(employeeDOM.avatar.inputField, changeLabelAvatar)
addClick(employeeDOM.experience.addExperienceBtn, addExperienceToExperienceContainer)
addClick(employeeDOM.skills.addBtn, addElementToContainer.bind(null, employeeDOM["skills"], false))
addClick(employeeDOM.links.addBtn, addElementToContainer.bind(null, employeeDOM["links"], true))
