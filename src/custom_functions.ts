const getById = <T extends string>(el: T): HTMLElement | null => { return document.getElementById(el) }

export type RecursiveHTMLElement<T> = {
    [K in keyof T]: T[K] extends string ? HTMLElement | null : RecursiveHTMLElement<T[K]>
}

export const getAllById = <T extends Record<string, any>>(obj: T): RecursiveHTMLElement<T> => {
    const results = {} as RecursiveHTMLElement<T>
    Object.keys(obj).forEach((key) => {
        const element = obj[key]
        if (typeof element === "string") {
            results[key as keyof T] = getById(element) as RecursiveHTMLElement<T>[keyof T]
        }
        else if (typeof element === "object") {
            results[key as keyof T] = getAllById(element) as RecursiveHTMLElement<T>[keyof T]
        }
    });
    return results
}

export const clearInputField = (element: HTMLInputElement) => { element.value = "" }

export const clearWhiteSpacesInData = (data: string) => data.trim()

// /* Change name for validateData func to something like process clarify */
export const validateData = (data: string) => {
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

export const validateEmail = (email: string) => {
    email = clearWhiteSpacesInData(email)
    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regExp.test(email)) {
        throw new Error("Nieprawidłowy email.")
    }
    return email
}

export const validatePhoneNumber = (phoneNumber: number) => {
    const s = phoneNumber.toString()
    if (s.length != 9) {
        throw new Error("Długość numeru nie jest równa 9")
    }
    for (let el of s) {
        if (!(el >= "0" && el <= "9")) {
            throw new Error("Numer nie zawiera samych cyfr")
        }
    }
    return phoneNumber
}

export const addClick = (el: HTMLElement, func: () => void) => { el.addEventListener("click", func) }
export const addChange = (el: HTMLElement, func: () => void) => { el.addEventListener("change", func) }
export const addDblClick = (el: HTMLElement, func: (event?: MouseEvent) => void) => { el.addEventListener("dblclick", func) }
export const addSubmit = (el: HTMLElement, func: () => void) => { el.addEventListener("submit", func) }

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