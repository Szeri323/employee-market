import { addChange, addDblClick, addSubmit, getAllById, prepare } from "./custom_functions"

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
const getEmployeeWithParameterFromDB = async () => {
    const skillsArray = createSkillsArrayFromContainer()
    const container = companyDOM.results.container

    container.innerHTML = ""
    if (skillsArray) {
        const { getDocsWithQueryFromDB } = await import("./db_operations")
        const whereParams = ["skills", "array-contains-any", skillsArray]
        const orderParams = ["avatar", "desc"]
        const querySnapshot = await getDocsWithQueryFromDB(whereParams, orderParams);
        querySnapshot.forEach((doc) => {
            addEmployeeToResultsContainer(doc.data()["avatar"], doc.data()["personalData"]["name"], doc.data()["skills"])
        })
    }
}

export const getSkillsFromDB = async () => {
    const SkillsSet = new Set()
    const selectSkills = companyDOM.selectSkills

    const { getDocsFromDB } = await import("./db_operations")

    const docsSnapshot = await getDocsFromDB();
    docsSnapshot.forEach((doc) => {
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

    const avatar = prepare("img", {
        avatar: "avatar",
        src: employeeAvatar
    })

    const name = prepare("h3", {
        textContent: employeeName
    })

    const skillArray = employeeSkills.map((skill) =>
        prepare("span", {
            textContent: skill
        })
    )

    const skills = prepare("div", {
        children: skillArray
    })

    const data = prepare("div", {
        classes: "user-data",
        children: [name, skills]
    })

    const employeeBox = parent("div", {
        children: [data, avatar]
    })

    parent(container, {
        children: employeeBox
    })

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
addSubmit(searchForm, (event) => {
    event.preventDefault()
    getEmployeeWithParameterFromDB()
})