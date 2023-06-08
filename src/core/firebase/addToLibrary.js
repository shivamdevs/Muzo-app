import { getDoc, setDoc, doc } from 'firebase/firestore';
import firebase from './config';
export default function addToLibrary(user, object) {
    return new Promise((resolve) => {
        setDoc(doc(firebase.store, "muzo", user.uid), object, { merge: true }).then((result) => {
            resolve({ type: 'success', success: true });
        }).catch((err) => {
            console.error(err);
            resolve({ type: 'success', success: true, data: 'An error occurred while adding song to library.' });
        });;
    });
}

export function deleteFromLibrary(user, callback) {
    return new Promise((resolve) => {
        getDoc(doc(firebase.store, "muzo", user.uid)).then((result) => {
            if (result.exists()) {
                const data = callback(result.data());
                return setDoc(doc(firebase.store, "muzo", user.uid), data);
            } else {
                resolve({ type: 'success', success: true, data: 'An error occurred while adding song to library.' });
            }
        }).then(() => {
            resolve({ type: 'success', success: true });
        }).catch((err) => {
            console.error(err);
            resolve({ type: 'success', success: true, data: 'An error occurred while adding song to library.' });
        });;
    });
}