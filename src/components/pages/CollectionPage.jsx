import React, { useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppData from '../../core/app/AppData';

function CollectionPage({ type }) {

    const { code } = useParams();
    const [collection, setCollection] = useState(null);

    useEffect(() => {
        axios.get(`${AppData.api}/${type}?id=${code}`).then((result) => {
            console.log(result.data.data);
            setCollection(result.data.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [code, type]);

    return (
        <Pagination title={collection ? null : "Loading..."} cover={collection && {
            image: collection.image[2].link,
            name: collection.name,
            artist: collection.primaryArtists,
            songs: collection.songCount,
            release: collection.releaseDate,
            share: collection.shares,
            follow: collection.followerCount,
            fan: collection.fanCount,
            play: collection.songs.map(song => parseInt(song.duration)).reduce((time, sum) => (time + sum), 0),
        }} value={collection?.songs} />
    );
}

export default CollectionPage;
