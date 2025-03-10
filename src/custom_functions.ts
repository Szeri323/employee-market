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


// do tworzenia elementów dom
// options i argumenty w nim są warunkowe, a to skraca wywoływanie funkcji
// dodajesz tylko to co jest potrzebne w danym momencie

export const prepare = (node: HTMLElement | HTMLImageElement | string, options?: {
    classes?: string[],
    children?: HTMLElement[],
    src?: string,
    inner?: string,
    // możesz dodawać więcej atrybutów np:
    // removeClasses: string[],
    // delete: boolean,
    // id: string,
}) => {
    const elem: HTMLElement | HTMLImageElement =
        typeof node === "string" ? document.createElement(node) : node

    if (elem) {
        // kolekcje pozwalają zrobić kilka zmian za jednym podejściem
        options?.classes?.forEach((c) => elem.classList.add(c))
        options?.children?.forEach((c) => elem.appendChild(c))

        if (options?.src && elem instanceof HTMLImageElement) {
            elem.src = options.src
        }
        if (options?.inner) {
            elem.textContent = options.inner
        }

        return elem
    }
}

// do do ts, to najłatwiej jak funkcję w js dasz do GPT i powiesz, żeby otypował w ts
// doskonale nie będzie, bo jak masz dużo odniesień w danej funkcji do exportów
// to ich nie będzie widział, ale na początek wystarczy
// i możesz robić to po kawału: nie wszystko musisz otypować, zby kod się kompilował
// i pliki ts i js możesz mieszać ze sobą - vite to obsługuje z tego co widzę

// i jeszcze jedna estetyczna rzecz:
// w js wymiennie używasz cudzysłowu "" i ''
// w większości współczesnych konwencji pisania używa się ''
// używanie "" pojawia się na starych projektach, albo jak na projekcie projekt menagerem
// jest senior, który pracuje ponad 20 lat ;)
// jakkolwiek, dobrze by było gdybyś zdecydował się na którąś wersję w całym projekcie