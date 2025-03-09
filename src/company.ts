export { searchForm, getEmployeeWithParameterFromDB, getSkillsFromDB }
import { collection, query, where, getDocs, and } from "firebase/firestore"
import { addChange, addDblClick, getAllById } from "./custom_functions"

const companyDOMElementIds = {
    searchForm: "search-form",
    selectSkills: "select-skills-search",
    selectLanguages: "select-languages-search",
    selectLanguageLevel: "select-language-level-search",
    searchBtn: "search-btn",
    results: {
        container: "results-search"
    },
    searchParams: "search-params-container"

}

const companyDOM = getAllById(companyDOMElementIds)
const searchForm = companyDOM["searchForm"]

const selects = [companyDOM.selectSkills, companyDOM.selectLanguages, companyDOM.selectLanguageLevel]

/* DB operations */
const getEmployeeWithParameterFromDB = async (db, collectionName) => {
    const employeeRef = collection(db, collectionName)
    const skillsArray = createSkillsArrayFromContainer()
    const container = companyDOM.results.container

    const q = query(employeeRef, where("skills", "array-contains-any", skillsArray))

    container.innerHTML = ""

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        addEmployeeToResultsContainer(doc.data()["avatar"], doc.data()["personalData"]["name"], doc.data()["skills"])
    })
}

const getSkillsFromDB = async (db, collectionName) => {
    const employeeRef = collection(db, collectionName)
    const SkillsSet = new Set()
    const selectSkills = companyDOM.selectSkills

    const querySnapshot = await getDocs(employeeRef);
    querySnapshot.forEach((doc) => {
        doc.data()["skills"].forEach((skill) => {
            SkillsSet.add(skill)
        })
    })

    SkillsSet.forEach((skill) => {
        const skillEl = document.createElement("option")
        skillEl.value = skill
        skillEl.textContent = skill
        selectSkills.appendChild(skillEl)
    })
}


/* Form Management */
const addItemToContainer = (select) => {
    const container = companyDOM.searchParams
    const entryArray = []
    for (let el of container.children) {
        entryArray.push(el.textContent)
    }
    const el = document.createElement("p")
    if (select.value && !entryArray.includes(select.value)) {
        el.textContent = select.value
        addDblClick(el, (event) => {
            event.target.remove()
        })
        container.appendChild(el)
        entryArray.push(select.value)
    }
}

const addEmployeeToResultsContainer = (employeeAvatar, employeeName, employeeSkills) => {
    const container = companyDOM.results.container

    const employeeBox = document.createElement("div")
    const avatar = document.createElement("img")
    const data = document.createElement("div")
    const name = document.createElement("h3")
    const skills = document.createElement("div")

    employeeBox.classList.add("user-box")
    avatar.classList.add("avatar")
    data.classList.add("user-data")
    skills.classList.add("user-skills")

    avatar.src = `${employeeAvatar}`

    name.textContent = employeeName

    employeeSkills.forEach((skill) => {
        const span = document.createElement("span")
        span.textContent = skill
        skills.appendChild(span)
    })

    data.appendChild(name)
    data.appendChild(skills)

    employeeBox.appendChild(avatar)
    employeeBox.appendChild(data)

    container.appendChild(employeeBox)
}


/* Custom Functions */
const createSkillsArrayFromContainer = () => {
    const container = companyDOM.searchParams
    if (container.children.length == 0) {
        return null
    }
    const skillsArray = []
    for (let el of container.children) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}


/* Event listeners */
selects.forEach((select) => {
    addChange(select, addItemToContainer.bind(null, select))
})
