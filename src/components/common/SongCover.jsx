import React, { useContext } from 'react';
import PlayIcon from '../icons/PlayIcon';
import Tippy from '@tippyjs/react';
import "../../styles/Pagination.scss";
import parseTime from '../../core/app/parseTime';
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import AppContext from '../../core/app/AppContext';
import { toast } from 'react-hot-toast';
import removeDuplicateObjectsById from '../../core/app/removeDuplicateObjectsById';
import addToLibrary, { deleteFromLibrary } from '../../core/firebase/addToLibrary';
import { MdOutlinePlaylistAddCheck, MdOutlinePlaylistRemove, MdQueueMusic } from 'react-icons/md';
import AddRemoveFavorite from '../user/AddRemoveFavorite';

function SongCover({ cover, songs, asFav, removeFav }) {

    const { user, playerElement, updatePlayerList, updatePlayerIndex, userCDbFavorites } = useContext(AppContext);

    const addSongs = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding songs...');
        playerElement.pause();
        updatePlayerList(songs);
        updatePlayerIndex(0);
        toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""}.`, { id: cached });
    };

    const addSongsToQueue = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding songs to queue...');
        updatePlayerList(old => {
            const list = [...(old || [])];
            for (const item of songs) !list.includes(item) && list.push(item);
            return removeDuplicateObjectsById(list);
        });
        updatePlayerIndex(ind => ((!ind || ind < 0) ? 0 : ind));
        toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""} to queue.`, { id: cached });
    };

    const addSongsToLibrary = async () => {
        const cached = toast.loading('Adding songs to library...');
        const newIds = {};
        for (const item of songs) newIds[item.id] = Date.now();
        console.log(newIds);
        await addToLibrary(user, { favorites: newIds });
        toast.success(`Added ${songs.length} song${songs.length > 1 ? "s" : ""} to library.`, { id: cached });
    };

    const removeSongFromLibrary = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Removing song from library...');
        await deleteFromLibrary(user, (response) => {
            for (const song of songs) delete response?.favorites?.[song.id];
            return response;
        });
        toast.success(`Removed ${songs.length} song${songs.length > 1 ? "s" : ""} from library.`, { id: cached });
    };


    return (
        <section className='songCover'>
            <div className="image" style={{ backgroundImage: `url(${cover?.image})` }}>
                <Tippy content="Play">
                    <div className="play" onClick={addSongs}>
                        <PlayIcon size={70} />
                    </div>
                </Tippy>
            </div>
            {cover && <div className="metadata">
                <div className="name">{convertHTMLEntities(cover.name)}</div>
                <div className="artist">{convertHTMLEntities(cover.artist)}</div>
                <div className="blur"><span>Play time:</span> {parseTime(cover.play || cover.duration || 0)}</div>
                {cover.label && <div className="artist">{convertHTMLEntities(cover.label)}</div>}
                {cover.songs && <div className="blur"><span>Songs:</span> {cover.songs}</div>}
                {cover.plays && <div className="blur"><span>Plays:</span> {cover.plays}</div>}
                {cover.release && <div className="blur"><span>Released on:</span> {cover.release}</div>}
                {cover.share && <div className="blur"><span>Shares:</span> {cover.share}</div>}
                {cover.fan && <div className="blur"><span>Fans:</span> {cover.fan}</div>}
                {cover.follow && <div className="blur"><span>Followers:</span> {cover.follow}</div>}
                <div className="btn">
                    <Tippy content="Add to Queue"><button type="button" onClick={addSongsToQueue}><MdQueueMusic /></button></Tippy>
                    {asFav ? <AddRemoveFavorite song={asFav} user={user} favorites={userCDbFavorites} /> : <button type="button" disabled={!user} onClick={removeFav ? removeSongFromLibrary : addSongsToLibrary}> {removeFav ? <><MdOutlinePlaylistRemove /> Remove from Favorites</> : <><MdOutlinePlaylistAddCheck /> Add to Library</>}</button>}
                </div>
            </div>}
        </section>
    );
}

export default SongCover;
