import { db } from '../../firebase';
import collections from '../collections';
import { addDoc, collection, doc, FirestoreDataConverter, getDoc } from 'firebase/firestore';
import { PaymentEventData } from './types';

const eventsRef = collection(db, collections.ADYEN_EVENTS);

const saveEvents = async (paymentDatas: PaymentEventData[]) => {
  const savedJobs = paymentDatas.map(async (paymentData) => {
    const docRef = doc(db, collections.ADYEN_EVENTS, paymentData.pspReference);
    const event = await getDoc(docRef);
    if (!event.exists()) {
      addDoc(eventsRef.withConverter(eventConverter), paymentData);
    }
  });
  await Promise.all(savedJobs);
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
