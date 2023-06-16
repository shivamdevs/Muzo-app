import { setDoc, doc } from 'firebase/firestore';
import firebase from './config';
export default function addToLibrary(user, object) {
    return new Promise((resolve) => {
        setDoc(doc(firebase.store, "muzo-favorites", user.uid), object, { merge: true }).then((result) => {
            resolve({ type: 'success', success: true });
        }).catch((err) => {
            console.error(err);
            resolve({ type: 'error', error: true, data: 'An error occurred while adding song to library.' });
        });
    });
}