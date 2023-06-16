import React, { useCallback, useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppData from '../../core/app/AppData';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import firebase from '../../core/firebase/config';
import { parseDate } from '../../core/app/parseTime';

function PlaylistPage() {

    const { code } = useParams();
    const [collection, setCollection] = useState(null);
    const [collectionData, , collectionError] = useDocumentOnce(doc(firebase.store, "muzo-playlists", code));

    useEffect(() => {
        if (collectionError) console.error(collectionError);
    }, [collectionError]);

    useEffect(() => () => setCollection(null), []);

    const sortCollection = useCallback(async (data) => {
        if (data.doc.exists && data.data) {
            const idArray = Object.entries(data.data)?.filter(item => !["ciU", "ciM", "ciN", "ciC"].includes(item[0]))?.filter(item => item[1])?.sort((a, b) => a[1] - b[1])?.map(item => item[0])?.sort();
            const ids = (idArray || [])?.join(",");
            if (ids) {
                axios.get(`${AppData.api}/songs?id=${ids}`).then((result) => {
                    const forward = result.data.data;
                    const newFav = [];
                    for (const fav of idArray) {
                        const favF = forward.find(favJ => favJ.id === fav);
                        favF && newFav.push(favF);
                    }
                    setCollection(newFav);

                }).catch((err) => {
                    console.error(err);
                });
            } else {
                setCollection([]);
            }
        } else {
            setCollection(null);

        }
    }, []);

    useEffect(() => {
        if (collectionData) {
            const data = {
                data: (collectionData.data() || {}),
                doc: {
                    exists: collectionData.exists(),
                    ref: collectionData.ref,
                    org: collectionData,
                    id: collectionData.id
                },
            };
            sortCollection(data);
        }
    }, [collectionData, sortCollection]);

    return (
        <Pagination title={collection ? null : "Loading..."} cover={collection && {
            image: collection?.[0].image[2].link,
            name: collectionData?.data()?.ciN,
            artist: { uid: collectionData?.data()?.ciU },
            songs: collection?.length,
            release: parseDate(collectionData?.data()?.ciC),
            modify: collectionData?.data()?.ciM,
            play: collection.map(song => parseInt(song.duration)).reduce((time, sum) => (time + sum), 0),
        }} value={collection} />
    );
}

export default PlaylistPage;
