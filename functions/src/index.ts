import * as functions from 'firebase-functions';
import { TransactionRecord } from '../../src/db/records/types';
import records from '../../src/db/records/records';
import vendors from '../../src/db/vendors/vendors';
import collections from '../../src/db/collections';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

functions.firestore.document(`${collections.RECORDS}/{recordId}`)
  .onCreate(async (snap, context) => {
    // @ts-ignore
    const record: TransactionRecord = records.recordConverter.fromFirestore(snap);
    const vendorUUID = record.vendorUUID;
    const amount = record.amount;

    const vendor = await vendors.getVendorById(vendorUUID);
    vendor.balance = vendor.balance + amount;

    vendors.updateVendor(vendorUUID, vendor);
  });

