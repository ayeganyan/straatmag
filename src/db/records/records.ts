//@ts-nocheck
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
    QueryDocumentSnapshot, getDocs, Query
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import {VendorUUID} from "../vendors/types";
import {TransactionRecord, RecordType, RecordUUID, TransactionRecordForm} from "./types";

const recordsRef = collection(db, collections.RECORDS)

async function addRecord(record: Record): Promise<VendorUUID> {
    const recordId = uuidv4()
    console.log(record)
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

async function getRecordsByVendor(vendorUUID: VendorUUID, page: number = 0, pageSize: number = 100): Promise<Record[]> {
    const recordsQuery =  query(recordsRef,
        where("vendorUUID", "==", vendorUUID),
        orderBy("timestamp"),
        startAt(page * pageSize + 1),
        limit(pageSize))
        .withConverter(recordConverter)
    const records = await getDocs(recordsQuery);
    return records.docs.map(s => s.data()).reverse( )
}

async function processTransactionEntry(formData: TransactionRecordFormValue): Promise<VendorUUID> {
    console.log(formData)
    const record: Record = {
        uuid: uuidv4(),
        timestamp: formData.timestamp,
        type: formData.type,
        amount: [RecordType.BUY, RecordType.CASH_OUT].includes(formData.type) ? -formData.amount : formData.amount,
        vendorUUID: formData.vendorUUID,
        comment: formData.comment || null
    }
    if (RecordType.BUY === formData.type) {
        record.details = {
            count: +formData.count,
            productId: 'newspaper'
        }
    }
    await addRecord(record)

    if (RecordType.BUY === formData.type) {
        const secondRecord: Record = {
            uuid: uuidv4(),
            timestamp: formData.timestamp,
            type: RecordType.CASH_IN,
            amount: +formData.amountSecondary,
            vendorUUID: formData.vendorUUID,
            comment: formData.comment || null
        }
        await addRecord(secondRecord)
    }
}

const recordConverter: FirestoreDataConverter<TransactionRecord> = {
    toFirestore(record: TransactionRecord): DocumentData {
        console.log(record)
        return {
            uuid: record.uuid,
            timestamp: record.timestamp,
            type: record.type,
            details: record.details || null,
            amount: record.amount,
            vendorUUID: record.vendorUUID,
            comment: record.comment || null
        };
    },
    fromFirestore(snapshot): Record {
        const data = snapshot.data()
        return {
            uuid: data.uuid,
            timestamp: data.timestamp,
            type: data.type,
            details: data.details,
            amount: data.amount,
            vendorUUID: data.vendorUUID,
            comment: data.comment || null
        };
    }
}

export default {
    addRecord,
    getRecords,
    getRecordsByVendor,
    processTransactionEntry
}


