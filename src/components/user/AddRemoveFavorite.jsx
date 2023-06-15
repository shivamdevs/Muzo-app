import React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import addToLibrary, { deleteFromLibrary } from '../../core/firebase/addToLibrary';
import Tippy from '@tippyjs/react';

function AddRemoveFavorite({ song, className = null, user, favorites }) {

    if (!song) return null;

    const favorite = (favorites || []).find(item => item.id === song.id);

    const addSongToLibrary = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding song to library...');
        await addToLibrary(user, {
            favorites: {
                [song.id]: Date.now(),
            }
        });
        toast.success(`Added 1 song to library.`, { id: cached });
    };

    const removeSongFromLibrary = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Removing song from library...');
        await deleteFromLibrary(user, (response) => {
            delete response?.favorites?.[song.id];
            return response;
        });
        // setUserCDbFavorites(old => {
        //     if (old && Array.isArray(old)) {
        //         const list = [...old];
        //         list.splice(list.findIndex(it => it.id === data.id), 1);
        //         return list;
        //     }
        // });
        toast.success(`Removed 1 song from library.`, { id: cached });
    };
    return (
        <Tippy content={favorite ? "Remove from Favorites" : "Add to favorites"}>
            <button type="button" disabled={!user} className={className} onClick={(favorite ? removeSongFromLibrary : addSongToLibrary)}>
                {favorite ? <MdFavorite /> : <MdFavoriteBorder />}
            </button>
        </Tippy>
    )
}

export default AddRemoveFavorite;
