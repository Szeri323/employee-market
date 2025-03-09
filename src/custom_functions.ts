const getById = (el: string): HTMLElement | null => {
    return document.getElementById(el)
}

// zwraca obiekt o tej samej strukturze, ale z elementami DOM zamiast stringów
export type RecursiveHTMLElement<T> = {
    [K in keyof T]: T[K] extends string ? HTMLElement : RecursiveHTMLElement<T[K]>
}

export const getAllById = <T extends Record<string, any>>(obj: T): RecursiveHTMLElement<T> => {
    const results = {} as RecursiveHTMLElement<T>;

    Object.keys(obj).forEach((key) => {
        const element = obj[key];
        if (typeof element === "string") {
            results[key as keyof T] = getById(element) as RecursiveHTMLElement<T>[keyof T];
        } else if (typeof element === "object" && element !== null) {
            results[key as keyof T] = getAllById(element) as RecursiveHTMLElement<T>[keyof T];
        }
    });

    return results;
};

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

export const addDblClick = (el, func) => {
    el.addEventListener("dblclick", func)
}