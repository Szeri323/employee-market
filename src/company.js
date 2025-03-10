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
        const queryParams = ["skills", "array-contains-any", skillsArray]
        const querySnapshot = await getDocsWithQueryFromDB(queryParams);
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

    // const employeeBox = document.createElement("div")
    // const avatar = document.createElement("img")
    // const data = document.createElement("div")
    // const name = document.createElement("h3")
    // const skills = document.createElement("div")

    // employeeBox.classList.add("user-box")
    // avatar.classList.add("avatar")
    // data.classList.add("user-data")
    // skills.classList.add("user-skills")

    // avatar.src = `${employeeAvatar}`

    // name.textContent = employeeName

    // employeeSkills.forEach((skill) => {
    //     const span = document.createElement("span")
    //     span.textContent = skill
    //     skills.appendChild(span)
    // })

    // data.appendChild(name)
    // data.appendChild(skills)

    // employeeBox.appendChild(avatar)
    // employeeBox.appendChild(data)

    // container.appendChild(employeeBox)




    // to jest pomysł jak zblokować tworzenie elementów html
    // we wcześniejszej wersji elementy były tworzone w różnych częściach kodu
    // tu tworzenie ich i operacje na nich są pogrupowane / zamknięte w jedną funkcję
    // dzięki temu masz większy prządek w kodzie i łatwiej odnaleźć zachowania i zmiany elementów dom
    // jedyne co się zmienia, to że takie dodawanie elementów trzeba zaczynać od
    // najniżej położonych elementów w drzewie i kolejno iść w górę
    // do miejsca gdzie chcesz je przyłączyć, a kolejność przyłączania
    // zmienia kolejność elementów w 'children'

    //                  avatar ┐
    //               name ┐    │
    // skillsNames ┐      │    │
    //             skills ┤    │
    //                    data ┤
    //                         employeeBox ┐
    //                                     container

    const avatar = prepare('ing', {
        classes: ['avatar'],
        src: `${employeeAvatar}`
    })

    const name = prepare('h3', {
        inner: employeeName
    })

    const skillsNames = employeeSkills.map((skill) => {
        const span = prepare('span', {
            inner: skill
        })
    })

    const skills = prepare('div', {
        classes: ['user-skills'],
        children: skillsNames
    })

    const data = prepare('div', {
        classes: ['user-data'],
        children: [name, skills]
    })

    const employeeBox = prepare('div', {
        classes: ['user-box'],
        children: [avatar, data]
    })

    prepare(container, {
        children: [employeeBox]
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