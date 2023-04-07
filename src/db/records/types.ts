import { VendorUUID } from '../vendors/types';

/**
 * Scenarios:
 * 1. Vendor takes magazines / BUY
 *      - { amount: -10} {count: 5, productId: 11}
 * 2. Vendor takes magazines / CASH_IN
 *      - { amount: +10}
 * 3. Vendor sales magazines with QR, a.k.a transfers money / TRANSFER
 *      - { amount: +12}
 * 4. Vendor coming back for money, cash out / CASH_OUT
 *      - { amount: -2 }
 */

export type RecordUUID = string;

export enum RecordType {
  BUY = 'BUY',
  CASH_IN = 'CASH_IN',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_OUT = 'CASH_OUT',
}

export type BuyDetails = {
  count: number;
  productId: number;
};

export type TransactionRecord = {
  uuid?: RecordUUID;
  timestamp: string;
  type: RecordType;
  amount: number;
  vendorUUID: VendorUUID;
  details?: BuyDetails;
  comment?: string;
};

export type TransactionRecordFormValue = TransactionRecord & {
  amountSecondary?: number;
  count?: number;
};
