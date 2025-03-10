const getById = (el) => { return document.getElementById(el) }

export const getAllById = (obj) => {
    const results = {}
    Object.keys(obj).forEach((key) => {
        const element = obj[key]
        if (typeof element == "string") {
            results[key] = getById(element)
        }
        else if (typeof element == "object" && element != null) {
            results[key] = getAllById(obj[key])
        }
    });
    return results
}

export const clearInputField = (element) => { element.value = "" }

export const clearWhiteSpacesInData = data => data.trim()

export const validateData = (data) => {
    data = clearWhiteSpacesInData(data)
    data = data.toLowerCase()
    let newData = ""
    for (let char of data) {
        if (char != " ") {
            newData += char
        }
    }
    return newData
}

export const validateEmail = (email) => {
    email = clearWhiteSpacesInData(email)
    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regExp.test(email)) {
        throw new Error("Invalid email.")
    }
    return email
}

export const addClick = (el, func) => { el.addEventListener("click", func) }
export const addChange = (el, func) => { el.addEventListener("change", func) }
export const addDblClick = (el, func) => { el.addEventListener("dblclick", func) }
export const addSubmit = (el, func) => { el.addEventListener("submit", func)}