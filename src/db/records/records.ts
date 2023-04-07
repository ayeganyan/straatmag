import { db } from '../../firebase';
import collections from '../collections';
import {
  addDoc,
  collection,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { VendorUUID } from '../vendors/types';
import { RecordType, TransactionRecord, TransactionRecordFormValue } from './types';

const recordsRef = collection(db, collections.RECORDS);

async function addRecord(record: TransactionRecord): Promise<VendorUUID> {
  const recordId = uuidv4();
  console.log(record);
  await addDoc(collection(db, collections.RECORDS).withConverter<TransactionRecord>(recordConverter), {
    ...record,
    uuid: recordId,
  });
  return recordId;
}

async function getRecords(page: number, pageSize: number): Promise<TransactionRecord[]> {
  const recordsQuery = query(
    recordsRef,
    orderBy('timestamp'),
    startAt(page * pageSize + 1),
    limit(pageSize)
  ).withConverter(recordConverter);
  const records = await getDocs(recordsQuery);
  return records.docs.map((s) => s.data());
}

async function getRecordsByVendor(vendorUUID: VendorUUID, page = 0, pageSize = 100): Promise<TransactionRecord[]> {
  const recordsQuery = query(
    recordsRef,
    where('vendorUUID', '==', vendorUUID),
    orderBy('timestamp'),
    startAt(page * pageSize + 1),
    limit(pageSize)
  ).withConverter(recordConverter);
  const records = await getDocs(recordsQuery);
  return records.docs.map((s) => s.data()).reverse();
}

async function processTransactionEntry(formData: TransactionRecordFormValue): Promise<void> {
  console.log(formData);
  const record: TransactionRecord = {
    uuid: uuidv4(),
    timestamp: formData.timestamp,
    type: formData.type,
    amount: [RecordType.BUY, RecordType.CASH_OUT].includes(formData.type) ? -formData.amount : formData.amount,
    vendorUUID: formData.vendorUUID,
    comment: formData.comment,
  };
  if (RecordType.BUY === formData.type) {
    record.details = {
      count: formData.count ? +formData.count : 0,
      productId: 'newspaper',
    };
  }
  await addRecord(record);

  if (RecordType.BUY === formData.type) {
    const secondRecord: TransactionRecord = {
      uuid: uuidv4(),
      timestamp: formData.timestamp,
      type: RecordType.CASH_IN,
      amount: formData.amountSecondary ? +formData.amountSecondary : 0,
      vendorUUID: formData.vendorUUID,
      comment: formData.comment,
    };
    await addRecord(secondRecord);
  }
}

const recordConverter: FirestoreDataConverter<TransactionRecord> = {
  toFirestore(record: TransactionRecord): DocumentData {
    console.log(record);
    return {
      uuid: record.uuid,
      timestamp: record.timestamp,
      type: record.type,
      details: record.details || null,
      amount: record.amount,
      vendorUUID: record.vendorUUID,
      comment: record.comment || null,
    };
  },
  fromFirestore(snapshot): TransactionRecord {
    const data = snapshot.data();
    return {
      uuid: data.uuid,
      timestamp: data.timestamp,
      type: data.type,
      details: data.details,
      amount: data.amount,
      vendorUUID: data.vendorUUID,
      comment: data.comment || null,
    };
  },
};

export default {
  addRecord,
  getRecords,
  getRecordsByVendor,
  processTransactionEntry,
  recordConverter,
};
