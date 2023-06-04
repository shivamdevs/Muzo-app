import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppData from '../../core/app/AppData';
import PlayIcon from '../icons/PlayIcon';
import AppContext from '../../core/app/AppContext';
import convertHTMLEntities from '../../core/app/convertHTMLEntities';

function HomeListItem({ data = null }) {

    const { updatePlayerList, updatePlayerIndex, playerElement } = useContext(AppContext);
    const [songInfo, setSongInfo] = useState(null);

    const name = convertHTMLEntities(data?.name || data?.title);
    const artist = convertHTMLEntities((data?.primaryArtists || data?.artists)?.map((art) => art.name).join(", ") || "Various Artists");

    useEffect(() => {
        if (!data) return;
        const dataType = data.album ? "album" : data.type;
        const dataURL = data.album ? data.album.url : data.url;
        const isPlaylist = dataType === "playlist";
        const dataTypeEnded = dataType + (dataType.endsWith("s") ? "" : "s");
        axios.get(`${AppData.api}/${dataTypeEnded}?${isPlaylist ? `id=${data.id}` : `link=${dataURL}`}`).then(({ data: result }) => {
            setSongInfo(data.type === "song" ? result.data : result.data.songs);
        }).catch(error => console.error(error));
    }, [data]);

    const setSongs = (e) => {
        e.stopPropagation();
        playerElement.pause();
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