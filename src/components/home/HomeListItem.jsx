import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppData from '../../core/app/AppData';
import PlayIcon from '../icons/PlayIcon';
import AppContext from '../../core/app/AppContext';

function HomeListItem({ data = null }) {

    const { updatePlayerList, updatePlayerIndex } = useContext(AppContext);
    const [songInfo, setSongInfo] = useState(null);

    const name = data?.name || data?.title;
    const artist = (data?.primaryArtists || data?.artists)?.map((art) => art.name).join(", ") || "Various Artists";

    useEffect(() => {
        data && axios.get(`${AppData.api}/${data.type}${data.type.endsWith("s") ? "" : "s"}?${data.type === "playlist" ? `id=${data.id}` : `link=${data.url}`}`).then(({ data: result }) => {
            setSongInfo(data.type === "song" ? result.data : result.data.songs);
        }).catch(error => console.error(error));
    }, [data]);

    const setSongs = (e) => {
        e.stopPropagation();
        updatePlayerList(songInfo);
        updatePlayerIndex(0);
    };

    return (
        <div className="item">
            <div className="loader skeleton-loader"></div>
            {data && songInfo && <button type="button" onClick={() => console.log(data)} className="wrap" style={{ backgroundImage: `url(${data.image.find(item => item.quality === "500x500").link})` }}>
                <div className="opts">
                    <div className="play" title={`Play ${name}`} onClick={setSongs}>
                        <PlayIcon size={50} />
                    </div>
                </div>
                <div className="metadata">
                    <div className="name" title={name}>{name}</div>
                    <div className="artist" title={artist}>{artist}</div>
                </div>
            </button>}
        </div>
    );
}

export default HomeListItem;