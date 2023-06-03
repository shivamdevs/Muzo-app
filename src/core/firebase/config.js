import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuT7owM2lF6JqmWUionKIM1vQ2pOHgzRM",
    authDomain: "my-oasis-tech.firebaseapp.com",
    projectId: "my-oasis-tech",
    storageBucket: "my-oasis-tech.appspot.com",
    messagingSenderId: "180046491267",
    appId: "1:180046491267:web:f184a60c760b8c0eb375b6",
    measurementId: "G-WJZGXF8F3L"
};


const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);

const firebase = {
    app: firebaseApp,
    auth: firebaseAuth,
    store: firebaseFirestore,
};
export default firebase;

export {
    firebaseApp,
    firebaseAuth,
    firebaseFirestore,
};