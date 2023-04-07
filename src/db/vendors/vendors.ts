import { db } from '../../firebase';
import collections from '../collections';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Rfid, Vendor, VendorUUID } from './types';

const vendorsRef = collection(db, collections.VENDORS);

async function existsByRFID(rfid: Rfid) {
  try {
    await getVendorByRFID(rfid);
    return true;
  } catch (err) {
    return false;
  }
}

async function addVendor(vendor: Vendor): Promise<Vendor> {
  const vendorId = uuidv4();
  if (await existsByRFID(vendor.rfid)) {
    throw new Error(`Vendor with rfid "${vendor.rfid}" already exists`);
  }
  await addDoc(collection(db, collections.VENDORS).withConverter<Vendor>(vendorConverter), {
    ...vendor,
    uuid: vendorId,
    balance: 0,
  });

  return await getVendorById(vendorId);
}

async function updateVendor(uuid: VendorUUID, vendor: Vendor): Promise<void> {
  const oldVendorDoc = await getVendorById(uuid);
  if (!oldVendorDoc) {
    return Promise.reject(new Error(`Vendor with id ${uuid} does not exist`));
  }
  const docRef = doc(vendorsRef, vendor.uuid);
  await updateDoc(docRef, { ...vendor });
}

async function getVendorById(vendorId: VendorUUID): Promise<Vendor> {
  const queryVendorById = query(vendorsRef, where('uuid', '==', vendorId)).withConverter(vendorConverter);

  const vendorsSnapshot = await getDocs(queryVendorById);
  const doc = vendorsSnapshot.docs.at(0);

  return doc ? doc.data() : Promise.reject(new Error(`Vendor with uuid "${vendorId}" does not exist`));
}

async function getVendorByRFID(rfId: Rfid): Promise<Vendor> {
  const queryVendorById = query(vendorsRef, where('rfid', '==', rfId)).withConverter(vendorConverter);

  const vendorsSnapshots = await getDocs(queryVendorById);
  const vendorSnapshot = vendorsSnapshots.docs.at(0);
  return vendorSnapshot ?
    vendorSnapshot.data() :
    Promise.reject(new Error(`Vendor with rfid "${rfId}" does not exist`));
}

// Exact match for the name is not the option, will figure it out
async function getVendorByName(name: string): Promise<Vendor> {
  const queryVendorById = query(vendorsRef, where('name', '==', name)).withConverter(vendorConverter);

  const vendorsSnapshots = await getDocs(queryVendorById);
  const vendorsSnapshot = vendorsSnapshots.docs.at(0);
  return vendorsSnapshot ?
    vendorsSnapshot.data() :
    Promise.reject(new Error(`Vendor with name "${name}' does not exist`));
}

async function getAllVendors(): Promise<Array<Vendor>> {
  const queryVendorById = query(vendorsRef).withConverter(vendorConverter);

  const vendorsSnapshot = await getDocs(queryVendorById);
  const vendorDocs = vendorsSnapshot.docs;
  return vendorDocs.map((doc) => doc.data());
}

// converters

const vendorConverter: FirestoreDataConverter<Vendor> = {
  toFirestore: (vendor: Vendor) => {
    return {
      uuid: vendor.uuid,
      name: vendor.name,
      RFID: vendor.rfid,
      email: vendor.email,
    } as DocumentData;
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      uuid: data.uuid,
      name: data.name,
      rfid: data.RFID,
      email: data.email,
    } as Vendor;
  },
};

const vendors = {
  addVendor,
  getVendorById,
  getVendorByName,
  getVendorByRFID,
  updateVendor,
  getAllVendors,
};

export default vendors;
