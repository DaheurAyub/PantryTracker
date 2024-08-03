// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEYH0O4UpDVP7-o1R8KM_aKMJdTsJIOlU",
  authDomain: "inventory-management-1caed.firebaseapp.com",
  projectId: "inventory-management-1caed",
  storageBucket: "inventory-management-1caed.appspot.com",
  messagingSenderId: "844765225142",
  appId: "1:844765225142:web:4518ddb762a275eac64617",
  measurementId: "G-E160XVTZBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}