import { db } from '../../firebase';
import collections from '../collections';
import { doc, FirestoreDataConverter, getDoc, runTransaction } from 'firebase/firestore';
import { PaymentEventData } from './types';

const saveEvents = async (paymentDatas: PaymentEventData[]) => {
  await runTransaction(db, async (transaction) => {
    for (const paymentData of paymentDatas) {
      const docRef = doc(db, collections.ADYEN_EVENTS, paymentData.pspReference);
      const event = await getDoc(docRef);
      if (!event.exists()) {
        transaction.set(docRef, eventConverter.toFirestore(paymentData));
      }
    }
  });
};

const eventConverter: FirestoreDataConverter<PaymentEventData> = {
  toFirestore: (event: PaymentEventData) => {
    const data = event.data;
    return {
      ...data,
    };
  },
  fromFirestore: (snapshot): PaymentEventData => {
    const data = snapshot.data();
    return {
      ...data,
    } as PaymentEventData;
  },
};

export default {
  saveEvents,
};
