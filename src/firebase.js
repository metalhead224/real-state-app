// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR2TDQVkguS_u3t2yhSlHLOfSMJ-WNVPk",
  authDomain: "realtor-clone-react-4207d.firebaseapp.com",
  projectId: "realtor-clone-react-4207d",
  storageBucket: "realtor-clone-react-4207d.appspot.com",
  messagingSenderId: "1022308517183",
  appId: "1:1022308517183:web:74f9df13ef225647c5ff8a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();