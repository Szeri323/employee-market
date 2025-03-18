export { addEmployeeDataToDB, employeeForm, fulfillFormFromDoc }
import { collection, doc, Firestore, setDoc } from "firebase/firestore"
import { clearInputField, clearWhiteSpacesInData, validateData, validateEmail, getAllById, addChange, addClick, addDblClick, RecursiveHTMLElement } from "./custom_functions"

const collectionName = "employees"


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


type employeeDomElementIdsKeysT = keyof typeof employeeDomElementIds
type employeeDomElementIdsValuesT = typeof employeeDomElementIds[employeeDomElementIdsKeysT]

const employeeDOM: RecursiveHTMLElement<typeof employeeDomElementIds> = getAllById(employeeDomElementIds)

const personalDataNames = ["name", "surname", "birthDate", "email", "phoneNumber"]
const experienceDataNames = ["jobTitle", "companyName", "startDate", "endDate", "jobDescription"]

const employeeForm = employeeDOM.form

/* DB operations */
const addEmployeeDataToDB = async (db: Firestore, userId: string | undefined) => {
    try {
        const employeeRef = collection(db, collectionName)
        const docRef = doc(employeeRef, userId)

        let ImageURL = ""
        const children = employeeDOM.avatar.label.children[0] as HTMLImageElement
        if (children.src) {
            ImageURL = children.src
        }
        else {
            ImageURL = await createURLFromImageFile() as string
        }

        const results = {}
        const personalData = employeeDOM.personalData

        Object.keys(personalData).forEach((key, i) => {
            const itemName = personalDataNames[i]
            const value = personalData[key].value
            if (itemName == "email") {
                results[itemName] = validateEmail(value)
            }
            else if (itemName == "birthDate") {
                results[itemName] = value
            }
            else {
                results[itemName] = clearWhiteSpacesInData(value)
            }
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
        employeeDOM.errorPreview.textContent = ""
    }
    catch (error) {
        console.error(error.message)
        employeeDOM.errorPreview.textContent = error.message
    }
}


/* Filling form form doc */
const fulfillFormFromDoc = (docSnapData: employeeDomElementIdsValuesT) => {
    setAvatarFromDocSnapData(docSnapData["avatar"])
    setPersonalDataInputsFromDocSnapData(docSnapData["personalData"])
    setExperienceInputsFromDocSnapData(docSnapData["experience"])
    setSkillFromDocSnapData(docSnapData["skills"])
    setLinksFromDocSnapData(docSnapData["links"])
}

const setAvatarFromDocSnapData = (avatar: AvatarValuesT) => {
    const label = employeeDOM.avatar.label
    const imageEl = document.createElement("img")

    const imageSource = avatar

    imageEl.src = imageSource

    label.textContent = ""
    label.appendChild(imageEl)
}

const setPersonalDataInputsFromDocSnapData = (personalData: PersonalDataValuesT) => {
    const personalDataEl = employeeDOM.personalData
    Object.keys(personalDataEl).forEach((key, i) => {
        personalDataEl[key].value = personalData[personalDataNames[i]]
    })
}

const setExperienceInputsFromDocSnapData = (experience: ExperienceValuesT) => {
    if (!experience) {
        return
    }
    const experienceContainer = employeeDOM.experience.experienceContainer as HTMLLinkElement

    for (let i = 1; i < experience.length; i++) {
        addExperienceToExperienceContainer()
    }

    for (let i = 0; i < experienceContainer.children.length; i++) {
        experienceDataNames.forEach((e, j) => {
            const children = experienceContainer.children[i].children[j] as HTMLInputElement
            children.value = experience[i][e]
        })
    }
}

const setSkillFromDocSnapData = (skills: SkillsValuesT) => {
    const skillsContainer = employeeDOM.skills.container

    for (let el of skills) {
        const skillEl = createEl(el)

        skillsContainer.appendChild(skillEl)
    }
}

const setLinksFromDocSnapData = (links: LinksValuesT) => {
    const linksContainer = employeeDOM.links.container

    for (let el of links) {
        const linkContainerEl = createContainerEl(el)

        linksContainer.appendChild(linkContainerEl)
    }
}


/* Form management */
const changeLabelAvatar = async (): Promise<void> => {
    const inputField = employeeDOM.avatar.inputField as HTMLInputElement | null
    const label = employeeDOM.avatar.label as HTMLLabelElement | null

    if (!inputField || !label || !inputField.files || inputField.files.length === 0) {
        return
    }

    const imageEl = document.createElement("img");

    try {
        const imageSource = await getBase64Image(inputField.files[0]) as string
        imageEl.src = imageSource

        label.textContent = ""
        label.appendChild(imageEl)
    } catch (error) {
        console.error("Error converting image to Base64:", error)
    }
};


const addExperienceToExperienceContainer = () => {
    const experienceContainer = employeeDOM.experience.experienceContainer
    if (!experienceContainer) return

    const experienceBoxEl = document.createElement("div")

    experienceBoxEl.classList.add("experience")

    experienceDataNames.forEach((name: string) => {
        const input = document.createElement("input")
        input.classList.add("input-field")
        if (name == "startDate" || name == "endDate") {
            input.setAttribute("type", "date")
        }
        experienceBoxEl.appendChild(input)
    })

    experienceContainer.appendChild(experienceBoxEl)
}
type ContainerObject = {
    inputField: HTMLInputElement;
    container: HTMLElement;
}

const addElementToContainer = (obj: ContainerObject, isContainer: boolean) => {
    /*
        isContainer checks if element is skillEL or linksContainer
    */
    const input = obj.inputField
    const container = obj.container
    let inputValue = input.value

    if (inputValue) {
        inputValue = validateData(inputValue)

        let el = new Object() as Node
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

type ExperienceData = {
    startDate: string
    endDate: string
    [key: string]: string
}

/* Custom consts */
const createArrayFromExperience = () => {
    const experienceArray = document.getElementsByClassName("experience")
    const newExperienceArray: ExperienceData[] = []

    for (const experience of experienceArray as unknown as HTMLCollectionOf<HTMLElement>) {
        const results: Partial<ExperienceData> = {}
        experienceDataNames.forEach((name, i) => {
            const child = experience.children[i] as HTMLInputElement
            const value = child.value.trim()

            results[name] =
                name === "startDate" || name === "endDate" ? value : clearWhiteSpacesInData(value)
        })
        if (results["endDate"]! < results["startDate"]!) {
            throw new Error("End date is earlier than start date.")
        }

        newExperienceArray.push(results as ExperienceData)
    }
    return newExperienceArray
}

const createArrayFromSkills = () => {
    const skillElsArray = employeeDOM.skills.container.children as HTMLCollectionOf<HTMLElement>
    const skillsArray: string[] = []

    for (const el of skillElsArray) {
        if (el.textContent) {
            skillsArray.push(el.textContent.trim())
        }
    }

    return skillsArray
}

const createArrayFromLinks = () => {
    const linkElsArray: HTMLCollection = employeeDOM.links.container?.children ?? []
    const linksArray: string[] = []

    for (let el of Array.from(linkElsArray)) {
        if (el instanceof HTMLElement && el.textContent !== null) {
            linksArray.push(el.textContent.trim())
        }
    }

    return linksArray
}


const createURLFromImageFile = async () => {
    const input = employeeDOM.avatar.inputField as HTMLInputElement | null

    if (!input || !input.files || input.files.length === 0) {
        return undefined
    }

    const imageURL = await getBase64Image(input.files[0]) as string
    return imageURL || undefined
};


const createEl = (value: string) => {
    const el = document.createElement("p")

    el.textContent = value

    addDblClick(el, (event: MouseEvent) => {
        const target = event.target as HTMLButtonElement
        target.remove()
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

    addDblClick(deleteLinkBtn, (event: MouseEvent) => {
        const target = event.target as HTMLButtonElement
        const parent = target.parentElement as HTMLElement
        parent.remove()
    })

    linkContainer.appendChild(linkEl)
    linkContainer.appendChild(deleteLinkBtn)
    return linkContainer
}

const getBase64Image = (file: File) => {
    return new Promise((resolve) => {
        convertFileToBase64(file, resolve)
    })
}

const convertFileToBase64 = (file: File, callback: (result: string | ArrayBuffer | null) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        callback(reader.result);
    };
};


/* Event listeners */
addChange(employeeDOM.avatar.inputField, changeLabelAvatar)
addClick(employeeDOM.experience.addExperienceBtn, addExperienceToExperienceContainer)
addClick(employeeDOM.skills.addBtn, addElementToContainer.bind(null, employeeDOM.skills, false))
addClick(employeeDOM.links.addBtn, addElementToContainer.bind(null, employeeDOM.links, true))
