export { searchForm, getEmployeeWithParameterFromDB }
import { collection, query, where, getDocs, and } from "firebase/firestore"


const searchForm = document.getElementById("search-form")
const selectSkillsSearchEl = document.getElementById("select-skills-search")
const skillsContainer = document.getElementById("skills-conatiner-search")
const searchBtn = document.getElementById("search-btn")
const resultsContainer = document.getElementById("results-search")


selectSkillsSearchEl.addEventListener("change", addItemToContainer)

/* DB operations */
async function getEmployeeWithParameterFromDB(db, collectionName) {
    const employeeRef = collection(db, collectionName)
    const skillsArray = createSkillsArrayFromContainer()
    console.log(skillsArray)

    let q = employeeRef

    if (skillsArray) {
        q = query(employeeRef, where("skills", "array-contains-any", skillsArray))
    }
    if (skillsArray && skillsArray.length == 2) {
        q = query(employeeRef,
            where("skills", "array-contains", skillsArray[0]),
            where("skills", "array-contains", skillsArray[1]),
        )
    }
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
        // const userBox = document.createElement("div")
        // const avatar = document.createElement("img")
        // const userDataBox = document.createElement("div")
        console.log(doc.id, " => ", doc.data());
    })
}


/* Form Management */

function addItemToContainer() {
    const entryArray = []
    for (let el of skillsContainer.children) {
        entryArray.push(el.textContent)
    }
    const skillEl = document.createElement("p")
    if (selectSkillsSearchEl.value && !entryArray.includes(selectSkillsSearchEl.value)) {
        skillEl.textContent = selectSkillsSearchEl.value
        skillsContainer.appendChild(skillEl)
        entryArray.push(selectSkillsSearchEl.value)
    }
}


/* Custom Functions */

function createSkillsArrayFromContainer() {
    if (skillsContainer.children.length == 0) {
        return null
    }
    const skillsArray = []
    for (let el of skillsContainer.children) {
        skillsArray.push(el.textContent)
    }
    return skillsArray
}