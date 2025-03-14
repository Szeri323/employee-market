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
export const addSubmit = (el, func) => { el.addEventListener("submit", func) }

export const prepare = (node: HTMLElement | HTMLImageElement | string, options?: {
    classes?: string[] | string
    src?: string
    href?: string
    text?: string
    children?: HTMLElement[]
}) => {
    const el = (typeof node === "string") ? document.createElement(node) : node

    if (Array.isArray(options?.children)) {
        const classes = options.classes as string[]
        classes.forEach((className) => {
            el.classList.add(className)
        })
    }
    else {
        el.classList.add(options?.classes as string)
    }
    if (el instanceof HTMLImageElement && options?.src) {
        el.src = options.src
    }
    if (el instanceof HTMLAnchorElement && options?.href) {
        el.href = options.href
    }
    if (options?.text) {
        el.textContent = options.text
    }
    options?.children?.forEach((child) => {
        el.appendChild(child)
    })

    return el
}