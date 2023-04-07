import * as functions from 'firebase-functions';
import { TransactionRecord } from '../../src/db/records/types';
import records from '../../src/db/records/records';
import vendors from '../../src/db/vendors/vendors';
import collections from '../../src/db/collections';
import adyenWebhookHandler from './adyen/adyenWebhookHandler';
import * as admin from 'firebase-admin';

admin.initializeApp();

functions.firestore.document(`${collections.RECORDS}/{recordId}`)
  .onCreate(async (snap, context) => {
    // @ts-ignore
    const record: TransactionRecord = records.recordConverter.fromFirestore(snap);
    const vendorUUID = record.vendorUUID;
    const amount = record.amount;

    const vendor = await vendors.getVendorById(vendorUUID);
    vendor.balance = vendor.balance + amount;

    await vendors.updateVendor(vendorUUID, vendor);
  });

exports.adyen = functions.https.onRequest(adyenWebhookHandler);
