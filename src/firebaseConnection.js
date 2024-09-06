import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBNm2zB56R8jTRmkXSyTbar9zBl2A4wGl4",
    authDomain: "ruankysa.firebaseapp.com",
    projectId: "ruankysa",
    storageBucket: "ruankysa.appspot.com",
    messagingSenderId: "867703399612",
    appId: "1:867703399612:web:d820c3f81681bbd64adcb9"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {db, auth};
