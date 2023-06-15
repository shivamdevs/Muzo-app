import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppData from '../../core/app/AppData';
import SongCover from '../common/SongCover';
import Pagination from '../common/Pagination';


function CollectionSong() {
    const { code } = useParams();
    const [collection, setCollection] = useState(null);

    useEffect(() => {
        axios.get(`${AppData.api}/songs?id=${code}`).then((result) => {
            console.log(result.data.data);
            setCollection(result.data.data[0]);
        }).catch((err) => {
            console.error(err);
        });
    }, [code]);
    return (
        <Pagination title="Song Info">
            <SongCover cover={collection && {
                image: collection.image[2].link,
                name: collection.name,
                artist: collection.primaryArtists,
                songs: collection.songCount,
                release: collection.releaseDate,
                plays: collection.playCount,
                label: collection.label,
                duration: collection.duration,
            }} songs={[collection]} asFav={collection} />
        </Pagination>
    );
}

export default CollectionSong;
