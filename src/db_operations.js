import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore"

const collectionName = "employees"

export const getDocFromDB = async (db, userId) => {
    const employeeRef = collection(db, collectionName)
    const docRef = doc(employeeRef, userId)

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    }
    else {
        console.log("Doc does not exists.")
    }
}

export const setDocInDB = async (db, userId, ImageURL, results, experienceArray, skillsArray, linksArray) => {
    const employeeRef = collection(db, collectionName)
    const docRef = doc(employeeRef, userId)

    await setDoc(docRef, {
        avatar: ImageURL,
        personalData: results,
        experience: experienceArray,
        skills: skillsArray,
        links: linksArray
    })
}

const buildQuery = (ref, queryParams) => {
    const collectionField = queryParams[0]
    const modifier = queryParams[1]
    const array = queryParams[2]
    return query(ref, where(collectionField, modifier, array))
}

export const getDocsWithQueryFromDB = async (db, queryParams) => {
    const employeeRef = collection(db, collectionName)
    const q = buildQuery(employeeRef, queryParams)
    return await getDocs(q)
}

export const getDocsFromDB = async (db) => {
    const employeeRef = collection(db, collectionName)
    return await getDocs(employeeRef)
}