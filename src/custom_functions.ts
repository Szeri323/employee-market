const getById = (el: string) => document.getElementById(el)

// typ generyczny zwraca obiekt o tej samej strukturze, ale z elementami DOM zamiast stringów
export type RecursiveHTMLElement<T> = {
    [K in keyof T]: T[K] extends string ? HTMLElement : RecursiveHTMLElement<T[K]>
}

// wszystko w <> przed argumentem funkcji pozwala na wpisanie typu do argumentu (obj: T)
export const getAllById = <T extends Record<string, any>>(obj: T) => {
    const results = {} as RecursiveHTMLElement<T>;

    Object.keys(obj).forEach((key) => {
        const element = obj[key]
        if (typeof element === "string") {
            results[key as keyof T] = getById(element) as RecursiveHTMLElement<T>[keyof T]
        } else if (typeof element === "object" && element !== null) {
            results[key as keyof T] = getAllById(element) as RecursiveHTMLElement<T>[keyof T]
        }
    });

    return results
}

export const clearInputField = (element: HTMLInputElement) => { element.value = "" }

export const clearWhiteSpacesInData = (data: string) => data.trim()

export const validateData = (data: string) => {
    // ty nadpisywałeś argument wchodzący do funkcji, taka mutacja zazwyczaj jest uważana za błąd
    const preparedData = clearWhiteSpacesInData(data).toLowerCase()
    let newData = ""
    for (let char of preparedData) {
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
        throw new Error("Invalid email.")
    }
    return email
}

export const addClick = (el: HTMLElement, func: () => void) => { el.addEventListener("click", func) }
export const addChange = (el: HTMLElement, func: () => void) => { el.addEventListener("change", func) }

export const addDblClick = (el: HTMLElement, func: (this: HTMLElement, event: MouseEvent) => void) => {
    el.addEventListener("dblclick", func)
}