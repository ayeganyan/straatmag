import * as functions from "firebase-functions";
import {TransactionRecord} from "../../src/db/records/types"
import {recordConverter} from "../../src/db/records/records"
import {getVendorById, updateVendor} from "../../src/db/vendors/vendors"
import collections from "../../src/db/collections"

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

functions.firestore
    .document(`${collections.RECORDS}/{recordId}`)
    .onCreate((snap, context) => {

        const record: TransactionRecord = recordConverter.fromFirestore(snap.data());
        const vendorUUID = record.vendorUUID
        const amount = record.amount

        const vendor = getVendorById(vendorUUID)
        vendor.balance = vendor.balance + amount

        updateVendor(vendorUUID, vendor)
    });
