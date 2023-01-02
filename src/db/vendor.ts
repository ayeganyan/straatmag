import { db } from "../firebase";
import collections from "./collections";


import { collection, addDoc, getDocs } from "firebase/firestore";
import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import DocumentData = firebase.firestore.DocumentData;

type Vendor = {
    name: string
    lastName: string
    rfid: string
    email: string
}

async function addVendor(vendor: Vendor): Promise<string> {
    const doc = await addDoc(
        collection(db, collections.VENDOR).withConverter<Vendor>(vendorConverter),
        vendor)
    return doc.id
}

async function getVendor(rfid: string) {
    const all = await getDocs(
        collection(db, collections.VENDOR).withConverter<Vendor>(vendorConverter)
    )
    return all.docs.filter(vendor => vendor.data()).at(0)
}

// converters

const vendorConverter: FirestoreDataConverter<Vendor> = {
    toFirestore: (vendor: Vendor) => {
        return {
            name: vendor.name,
            lastName: vendor.lastName,
            RFID: vendor.rfid,
            email: vendor.email
        } as DocumentData
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data()
        return {
            name: data.name,
            lastName: data.lastName,
            rfid: data.RFID,
            email: data.email
        } as Vendor
    }
}