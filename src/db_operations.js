import { collection, doc, getDoc, setDoc, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "./config"

const collectionName = "employees"

export const getDocFromDB = async (userId) => {
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

export const setDocInDB = async (userId, ImageURL, results, experienceArray, skillsArray, linksArray) => {
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

const buildWhere = (whereParams) => {
    const collectionField = whereParams[0]
    const modifier = whereParams[1]
    const array = whereParams[2]
    return where(collectionField, modifier, array)
}

const buildOrder = (orderParams) => {
    return orderBy(orderParams[0], orderParams[1])
}

const buildQuery = (ref, whereParams, orderParams) => {
    return query(ref, buildWhere(whereParams))
}

export const getDocsWithQueryFromDB = async (whereParams, orderParams) => {
    const employeeRef = collection(db, collectionName)
    const q = buildQuery(employeeRef, whereParams, orderParams)
    return await getDocs(q)
}

export const getDocsFromDB = async () => {
    const employeeRef = collection(db, collectionName)
    return await getDocs(employeeRef)
}