// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzwnAByZkmAMRofCRhPl8DXOcmZJ76M1M",
  authDomain: "somereplica.firebaseapp.com",
  projectId: "somereplica",
  storageBucket: "somereplica.appspot.com",
  messagingSenderId: "1084948093488",
  appId: "1:1084948093488:web:b9758378c465dd13016bf5"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, "http://localhost:9099");


export { db, auth };