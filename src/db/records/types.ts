import {VendorUUID} from "../vendors/types";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;


/**
 * Scenarios:
 * 1. Vendor takes magazines / BUY
 *      - { amount: -10} {count: 5, productId: 11}
 * 2. Vendor sales magazines with QR, a.k.a transfers money / TRANSFER
 *      - { amount: +12}
 * 3. Vendor coming back for money, cash out / CASH_OUT
 *      - { amount: -2 }
 */

export type RecordUUID = string

export enum RecordType {
    BUY,
    TRANSFER,
    CASH_OUT,
}

export type BuyDetails = {
    count: number
    productId: number
}

export type Record = {
    uuid?: RecordUUID
    timestamp: Timestamp
    type: RecordType
    count: number
    amount: number
    vendorUUID: VendorUUID
}