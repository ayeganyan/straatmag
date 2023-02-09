import { db } from "../firebase";
import collections from "./collections";
import {
    collection,
    addDoc,
    updateDoc,
    getDocs,
    FirestoreDataConverter,
    DocumentData,
    doc,
    query,
    where,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

type VendorUUID = string

type RFID = string

type Vendor = {
    uuid?: VendorUUID // Unique, non-null
    name: string // non-null
    rfid: RFID // Unique, non-null
    email: string // optional
}

const vendorsRef = collection(db, collections.VENDORS)

async function addVendor(vendor: Vendor): Promise<VendorUUID> {
    const vendorId = uuidv4()
    await addDoc(
        collection(db, collections.VENDORS)
            .withConverter<Vendor>(vendorConverter),
        {
            ...vendor,
            uuid: vendorId
        })
    return vendorId
}

async function getVendor(vendorId: VendorUUID): Promise<Vendor> {
    const vendorDoc = await getVendorDocById(vendorId);
    if (!vendorDoc) {
        return Promise.reject(`Vendor with id ${vendorId} does not exist`)
    }
    return vendorDoc.data()
}

async function getAllVendors(): Promise<Array<Vendor>> {
    const vendorDocs = await getAllVendorDocs();
    return vendorDocs.map(doc => doc.data())
}

async  function updateVendor(uuid: VendorUUID, vendor: Vendor): Promise<void> {
    const oldVendorDoc = await getVendorDocById(uuid)
    if (!oldVendorDoc) {
        return Promise.reject(`Vendor with id ${uuid} does not exist`)
    }
    const docRef = doc(vendorsRef, vendor.uuid)
    await updateDoc(docRef, {...vendor})
}

async function getVendorDocById(vendorId: VendorUUID): Promise<QueryDocumentSnapshot<Vendor>> {
    const queryVendorById = query(vendorsRef, where("id", "==", vendorId))
        .withConverter(vendorConverter)

    const vendorsSnapshot = await getDocs(queryVendorById)
    const doc = vendorsSnapshot.docs.at(0)

    return doc ? doc : Promise.reject(`Vendor with id ${vendorId} does not exist`)
}

async function getVendorDocByRFID(rfId: RFID): Promise<QueryDocumentSnapshot<Vendor> | undefined> {
    const queryVendorById = query(vendorsRef, where("rfid", "==", rfId))
        .withConverter(vendorConverter)

    const vendorsSnapshot = await getDocs(queryVendorById)
    return vendorsSnapshot.docs.at(0)
}

// Exact match for the name is not the option, will figure it out
async function getVendorDocByName(name: string): Promise<QueryDocumentSnapshot<Vendor> | undefined> {
    const queryVendorById = query(vendorsRef, where("name", "==", name))
        .withConverter(vendorConverter)

    const vendorsSnapshot = await getDocs(queryVendorById)
    return vendorsSnapshot.docs.at(0)
}

async function getAllVendorDocs(): Promise<Array<QueryDocumentSnapshot<Vendor>>> {
    const queryVendorById = query(vendorsRef)
        .withConverter(vendorConverter)

    const vendorsSnapshot = await getDocs(queryVendorById)
    const docs = vendorsSnapshot.docs

    return docs
}

// converters

const vendorConverter: FirestoreDataConverter<Vendor> = {
    toFirestore: (vendor: Vendor) => {
        return {
            uuid: vendor.uuid,
            name: vendor.name,
            RFID: vendor.rfid,
            email: vendor.email
        } as DocumentData
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data()
        return {
            uuid: data.uuid,
            name: data.name,
            rfid: data.RFID,
            email: data.email
        } as Vendor
    }
}

export { addVendor, getVendor, getAllVendors };
export type { Vendor };
