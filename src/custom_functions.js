


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

export const clearWitheSpacesInData = (data) => { return data.trim() }

export const addClick = (el, func) => { el.addEventListener("click", func) }
export const addChange = (el, func) => { el.addEventListener("change", func) }