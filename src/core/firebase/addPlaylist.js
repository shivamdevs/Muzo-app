import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import firebase from "./config";


export default async function addPlaylist(user, name, songs) {
    return new Promise((resolve) => {
        addDoc(collection(firebase.store, "muzo-playlists"), {
            ...(songs || {}),
            ciN: name,
            ciU: user.uid,
            ciC: Date.now(),
            ciM: Date.now(),
        }).then((result) => setDoc(doc(firebase.store, "muzo-user-playlists", user.uid), {
            [result.id]: {
                name,
                date: Date.now(),
            },
        }, { merge: true })).then(() => {
            resolve({ type: 'success', success: true, data: (songs ? `Added ${Object.keys(songs).length} songs to ${name}.` : `Created ${name}`) });
        }).catch((err) => {
            console.error(err);
            resolve({ type: 'error', error: true, data: 'An error occurred while adding song to playlist.' });
        });
    });
}

export async function addToPlaylist(list, songs) {
    return new Promise((resolve) => {
        setDoc(doc(firebase.store, "muzo-playlists", list.id), { ...(songs || {}), ciM: Date.now() }, { merge: true }).then(() => {
            resolve({ type: 'success', success: true, data: `Added ${Object.keys(songs).length} songs to ${list.name}.` });
        }).catch((err) => {
            console.error(err);
            resolve({ type: 'error', error: true, data: 'An error occurred while adding song to playlist.' });
        });
    });
}
