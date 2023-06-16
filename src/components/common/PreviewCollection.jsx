import React, { useContext } from 'react';
import "../../styles/Collection.scss";
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import Tippy from '@tippyjs/react';
import { MdOutlinePlaylistAdd, MdOutlinePlaylistAddCheck, MdOutlinePlaylistPlay, MdQueueMusic } from 'react-icons/md';
import AppContext from '../../core/app/AppContext';
import { OasisMenu, OasisMenuItem, OasisMenuTrigger } from 'oasismenu';
import { SlOptions } from 'react-icons/sl';
import { OasisMenuBreak } from 'oasismenu';
import PlayIcon from '../icons/PlayIcon';
import axios from 'axios';
import AppData from '../../core/app/AppData';
import getApiPathForQuickAction from '../../core/app/getApiPathForQuickAction';
import { toast } from 'react-hot-toast';
import addToLibrary from '../../core/firebase/addToLibrary';
import removeDuplicateObjectsById from '../../core/app/removeDuplicateObjectsById';
import { useNavigate } from 'react-router-dom';

function PreviewCollection({ data = null }) {

    const { user, updatePlayerList, updatePlayerIndex, playerElement, addAsPlayListDialogBox, setPlaylistAutoAdded } = useContext(AppContext);

    const navigate = useNavigate();

    if (data?.type === 'artist') return null;

    if (!data) return (<div className="collection-item as-grid"><div className="loader skeleton-loader" /></div>);

    const image = data.image.find(item => item.quality === "500x500").link;
    const name = convertHTMLEntities(data.name || data.title);
    const artistCollection = data.primaryArtists || data.artists;
    const artist = (artistCollection && Array.isArray(artistCollection) && artistCollection.map((art) => convertHTMLEntities(art.name)).join(", ")) || "Various Artists";

    const getSongs = () => {
        return new Promise((resolve) => {
            const splitPath = getApiPathForQuickAction(data.type);
            axios.get(`${AppData.api}/${splitPath}?id=${data.id}`).then((result) => {
                const songs = data.type === "song" ? result.data.data : result.data.data.songs;
                if (songs && Array.isArray(songs) && songs.length) return resolve({ type: 'success', success: true, length: songs.length, data: songs });
                return resolve({ type: 'error', error: true, data: 'No song was found.' });
            }).catch((err) => {
                console.error(err);
                resolve({ type: 'error', error: true, data: 'Failed to fetch songs.' });
            });
        });
    };

    const addSongs = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding songs...');
        const songs = await getSongs();
        if (songs.success) {
            playerElement.pause();
            updatePlayerList(songs.data);
            updatePlayerIndex(0);
            toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""}.`, { id: cached });
        } else {
            toast.error(`${songs.data}`, { id: cached });
        }
    };

    const addSongsToQueue = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding songs to queue...');
        const songs = await getSongs();
        if (songs.success) {
            updatePlayerList(old => {
                const list = [...(old || [])];
                for (const item of songs.data) !list.includes(item) && list.push(item);
                return removeDuplicateObjectsById(list);
            });
            updatePlayerIndex(ind => ((!ind || ind < 0) ? 0 : ind));
            toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""} to queue.`, { id: cached });
        } else {
            toast.error(`${songs.data}`, { id: cached });
        }
    };

    const addSongsToLibrary = async () => {
        const cached = toast.loading('Adding songs to library...');
        const songs = await getSongs();
        if (songs.success) {
            const newIds = {};
            for (const item of songs.data) newIds[item.id] = Date.now();
            await addToLibrary(user, newIds);
            toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""} to library.`, { id: cached });
        } else {
            toast.error(`${songs.data}`, { id: cached });
        }
    }

    const addSongsToPlaylist = async () => {
        const cached = toast.loading('Getting songs...');
        const songs = await getSongs();
        if (songs.success) {
            const newIds = {};
            for (const item of songs.data) newIds[item.id] = Date.now();
            setPlaylistAutoAdded({ name, songs: newIds });
            addAsPlayListDialogBox?.showModal();
            toast.dismiss(cached);
        } else {
            toast.error(`${songs.data}`, { id: cached });
        }
    }

    return (
        <div className="collection-item as-grid">
            <div className="loader skeleton-loader">
                <img src={image} alt={name} />
            </div>
            <button type="button" className="wrap" onClick={() => navigate(`/${getApiPathForQuickAction(data.type)}/${data.id}`)}>
                <div className="opts">
                    <div className="options">
                        <Tippy content="Add to queue">
                            <div className="fav" onClick={addSongsToQueue}>
                                <MdQueueMusic />
                            </div>
                        </Tippy>
                        <OasisMenuTrigger name={data.id} trigger='click' toggle>
                            <Tippy content="More">
                                <div className="add">
                                    <SlOptions />
                                </div>
                            </Tippy>
                        </OasisMenuTrigger>
                        <OasisMenu name={data.id} theme="space">
                            <OasisMenuItem content="Add to Queue" icon={<MdQueueMusic />} onClick={addSongsToQueue} />
                            <OasisMenuItem content="Play Now" icon={<MdOutlinePlaylistPlay />} onClick={addSongs} />
                            <OasisMenuBreak />
                            <OasisMenuItem content="Add to Library" disabled={!user} onClick={addSongsToLibrary} icon={<MdOutlinePlaylistAddCheck />} />
                            <OasisMenuItem content="Add as Playlist" disabled={!user} onClick={addSongsToPlaylist} icon={<MdOutlinePlaylistAdd />} />
                        </OasisMenu>
                    </div>
                    <Tippy content="Play">
                        <div className="play" onClick={addSongs}>
                            <PlayIcon size={50} />
                        </div>
                    </Tippy>
                    <div className="metadata">
                        <div className="name" title={name}>{name}</div>
                        <div className="artist" title={artist}>{artist}</div>
                    </div>
                </div>
            </button>
        </div>
    );
}

export default PreviewCollection;