import { addChange, addDblClick, addSubmit, getAllById, prepare } from "./custom_functions"
import { getDocsWithQueryFromDB, getDocsFromDB } from "./db_operations"

const results = {
    container: "results-search"
} as const

type ResultsKeysT = keyof typeof results
type ResultsValuesT = typeof results[ResultsKeysT]

const companyDOMElementIds = {
    searchForm: "search-form",
    selectSkills: "select-skills-search",
    selectLanguages: "select-languages-search",
    selectLanguageLevel: "select-language-level-search",
    searchBtn: "search-btn",
    results,
    searchParams: "search-params-container"

}

const companyDOM = getAllById(companyDOMElementIds)
const searchForm = companyDOM.searchForm

const selects = [companyDOM.selectSkills, companyDOM.selectLanguages, companyDOM.selectLanguageLevel]

/* DB operations */
const getEmployeeWithParameterFromDB = async () => {
    const skillsArray = createSkillsArrayFromContainer()
    const container = companyDOM.results.container
    if (container) {
        container.innerHTML = ""
        if (skillsArray) {

            const whereParams = ["skills", "array-contains-any", skillsArray]
            const orderParams = ["avatar", "desc"]
            const querySnapshot = await getDocsWithQueryFromDB(whereParams);
            querySnapshot.forEach((doc) => {
                addEmployeeToResultsContainer(doc.data()["avatar"], doc.data()["personalData"]["name"], doc.data()["skills"])
            })
        }
    }
}

export const getSkillsFromDB = async () => {
    const SkillsSet: Set<string> = new Set()
    const selectSkills = companyDOM.selectSkills

    const docsSnapshot = await getDocsFromDB();
    docsSnapshot.forEach((doc) => {
        doc.data()["skills"].forEach((skill: string) => {
            SkillsSet.add(skill)
        })
    })

    SkillsSet.forEach((skill) => {
        const skillEl = document.createElement("option")
        skillEl.value = skill
        skillEl.textContent = skill
        selectSkills?.appendChild(skillEl)
    })
}

/* Form Management */
const addItemToContainer = (select: HTMLElement | null) => {
    if (select instanceof HTMLSelectElement) {
        const container = companyDOM.searchParams
        const containerEls = Array.prototype.slice.call(container?.children)
        const entryArray = []
        for (let el of containerEls) {
            entryArray.push(el.textContent)
        }
        const el = document.createElement("p")
        if (select.value && !entryArray.includes(select.value)) {
            el.textContent = select.value
            addDblClick(el, (event) => {
                const el = event?.target as HTMLElement
                el.remove()
            })
            container?.appendChild(el)
            entryArray.push(select.value)
        }

    }
}

const addEmployeeToResultsContainer = (employeeAvatar: string, employeeName: string, employeeSkills: string[]) => {
    const container = companyDOM.results.container

    const avatar = prepare("img", {
        classes: ["avatar"],
        src: employeeAvatar
    })

    const name = prepare("h3", {
        text: employeeName
    })

    const skillArray = employeeSkills.map((skill) =>
        prepare("span", {
            text: skill
        })
    )

    const skills = prepare("div", {
        classes: ["user-skills"],
        children: skillArray
    })

    const data = prepare("div", {
        classes: ["user-data"],
        children: [name, skills]
    })

    const employeeBox = prepare("div", {
        classes: ["user-box"],
        children: [avatar, data]
    })
    if (container) {
        prepare(container, {
            classes: ["results"],
            children: employeeBox
        })
    }

}


/* Custom Functions */
const createSkillsArrayFromContainer = () => {
    const container = companyDOM.searchParams
    if (container?.children.length == 0) {
        return null
    }
    const containerEls = Array.prototype.slice.call(container?.children)
    const skillsArray = []
    for (let el of containerEls) {
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