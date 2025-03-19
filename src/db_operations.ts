import { collection, doc, getDoc, setDoc, query, where, getDocs, CollectionReference, WhereFilterOp } from "firebase/firestore"
import { db } from "./config"

const collectionName = "employees"

export const getDocFromDB = async (userId: string) => {
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

export const setDocInDB = async (userId: string, ImageURL: string, results: Record<string, any>, experienceArray: {}[], skillsArray: string[], linksArray: string[]) => {
    if (db && collectionName && userId) {
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
}

const buildQuery = (ref: CollectionReference, queryParams: (string | any)[]) => {
    const collectionField = queryParams[0]
    const modifier = queryParams[1]
    const array = queryParams[2]
    return query(ref, where(collectionField, modifier as WhereFilterOp, array))
}

export const getDocsWithQueryFromDB = async (queryParams: (string | any)[]) => {
    const employeeRef = collection(db, collectionName)
    const q = buildQuery(employeeRef, queryParams)
    return await getDocs(q)
}

export const getDocsFromDB = async () => {
    const employeeRef = collection(db, collectionName)
    return await getDocs(employeeRef)
}