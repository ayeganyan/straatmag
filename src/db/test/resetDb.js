import axios from "axios";
import firebaseConfig from '../../../firebase.json';
const firestoreEmulatorPort = firebaseConfig.emulators.firestore.port;

// Ref: https://stackoverflow.com/questions/65355410/how-to-reset-firestore-emulator-in-integration-test
async function clearDb() {
    const response = await axios.delete(`http://localhost:${firestoreEmulatorPort}/emulator/v1/projects/straatmag-9b162/databases/(default)/documents`)
    if (response.status !== 200) {
        throw new Error('Trouble clearing Emulator: ' + (await response.text()));
    }
}

async function populateDb(data) {
    // Logic for adding in any data you want in the db
    // before each test run
}

async function resetDb(data) {
    await clearDb();
    await populateDb(data);
}

export { resetDb };