import * as functions from 'firebase-functions';
import { TransactionRecord } from '../../src/db/records/types';
import Records from '../../src/db/records/records';
import Vendors from '../../src/db/vendors/vendors';
import collections from '../../src/db/collections';
import { QueryDocumentSnapshot } from 'firebase/firestore';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

functions.firestore.document(`${collections.RECORDS}/{recordId}`)
    .onCreate(async (snap, context) => {
      const record: TransactionRecord = Records.recordConverter.fromFirestore(snap as unknown as QueryDocumentSnapshot);
      const vendorUUID = record.vendorUUID;
      const amount = record.amount;

      const vendor = await Vendors.getVendorById(vendorUUID);
      vendor.balance = vendor.balance + amount;

      await Vendors.updateVendor(vendorUUID, vendor);
    });
