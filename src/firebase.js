// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANNoPumk8aYCvOde4P8El33EXsv5_HhlQ",
    authDomain: "straatmag-9b162.firebaseapp.com",
    projectId: "straatmag-9b162",
    storageBucket: "straatmag-9b162.appspot.com",
    messagingSenderId: "241081520448",
    appId: "1:241081520448:web:6fe1299dee3923c401eaa5",
    measurementId: "G-0MQMBK2VSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);