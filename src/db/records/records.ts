import { db } from "../../firebase";
import collections from "../collections";
import {
    collection,
    addDoc,
    FirestoreDataConverter,
    DocumentData,
    doc,
    query,
    where,
    orderBy,
    limit,
    startAt,
    QueryDocumentSnapshot, getDocs
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import {VendorUUID} from "../vendors/types";
import {Record, RecordType, RecordUUID} from "./types";

const recordsRef = collection(db, collections.RECORDS)

async function addRecord(record: Record): Promise<VendorUUID> {
    const recordId = uuidv4()
    await addDoc(
        collection(db, collections.RECORDS)
            .withConverter<Record>(recordConverter),
        {
            ...record,
            uuid: recordId
        })
    return recordId
}

async function getRecords(page: number, pageSize: number): Promise<Record[]> {

    const recordsQuery =  query(recordsRef,
            orderBy("timestamp"),
            startAt(page * pageSize + 1),
            limit(pageSize))
        .withConverter(recordConverter)
    const records = await getDocs(recordsQuery);
    return records.docs.map(s => s.data())
}

const recordConverter: FirestoreDataConverter<Record> = {
    toFirestore(record: Record): DocumentData {
        return {
            uuid: record.uuid,
            timestamp: record.timestamp,
            type: record.type,
            count: record.count,
            amount: record.amount,
            vendor: record.vendorUUID,
        };
    },
    fromFirestore(snapshot): Record {
        const data = snapshot.data()
        return {
            uuid: data.uuid,
            timestamp: data.timestamp,
            type: data.type,
            count: data.count,
            amount: data.amount,
            vendorUUID: data.vendorUUID,
        };
    }
}

export default {
    addRecord,
    getRecords
}


