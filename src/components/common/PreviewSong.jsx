import React, { useContext } from 'react';
import "../../styles/Collection.scss";
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import Tippy from '@tippyjs/react';
import { MdFavorite, MdFavoriteBorder, MdQueueMusic } from 'react-icons/md';
import AppContext from '../../core/app/AppContext';
import { toast } from 'react-hot-toast';
import addToLibrary, { deleteFromLibrary } from '../../core/firebase/addToLibrary';
import SongPlaying from '../icons/SongPlaying';
import { GiPlayButton } from 'react-icons/gi';
import classNames from 'classnames';
import parseTime from '../../core/app/parseTime';
import { useNavigate } from 'react-router-dom';

function PreviewSong({ data = null, count, favorite }) {

    const { user, updatePlayerList, playerList, updatePlayerIndex, playerElement, playerSong } = useContext(AppContext);

    const navigate = useNavigate();

    if (!data) return (<div className="collection-item as-list"><div className="loader skeleton-loader" /></div>);

    const image = data.image.find(item => item.quality === "150x150").link;
    const name = convertHTMLEntities(data.name || data.title);
    const artist = convertHTMLEntities(data.primaryArtists || "Various Artists");
    const playing = playerSong?.id === data.id;

    const addSong = async (e) => {
        e?.stopPropagation?.();
        if (playerSong?.id === data.id) {
            return toast.error("This song is already playing.", { duration: 800 });
        }
        const cached = toast.loading('Playing song...');
        playerElement.pause();
        updatePlayerList([data]);
        updatePlayerIndex(0);
        toast.success(`Playing 1 song.`, { id: cached });
    };

    const addSongToQueue = async (e) => {
        e?.stopPropagation?.();
        if (playerList?.find(item => item.id === data.id)) {
            return toast.error("This song is already in queue.", { duration: 800 });
        }
        const cached = toast.loading('Adding songs to queue...');
        updatePlayerList(old => {
            const list = [...(old || [])];
            !list.includes(data) && list.push(data);
            return list;
        });
        updatePlayerIndex(ind => ((!ind || ind < 0) ? 0 : ind));
        toast.success(`Added 1 song to queue.`, { id: cached });
    };

    const addSongToLibrary = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Adding song to library...');
        await addToLibrary(user, {
            favorites: {
                [data.id]: Date.now(),
            }
        });
        toast.success(`Added 1 song to library.`, { id: cached });
    };

    const removeSongFromLibrary = async (e) => {
        e?.stopPropagation?.();
        const cached = toast.loading('Removing song from library...');
        await deleteFromLibrary(user, (response) => {
            delete response?.favorites?.[data.id];
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

    const songInfo = (e) => {
        e?.stopPropagation?.();
        navigate(`/songs/${data?.id}`);
    };

    return (
        <div className="collection-item as-list" data-id={data.id}>
            <button type="button" className='list-box' onClick={addSong}>
                {count && <div className="count-play">
                    {playing ? <SongPlaying /> : <>
                        <span className="count">{count}</span>
                        <Tippy content="Play">
                            <span className="play"><GiPlayButton /></span>
                        </Tippy>
                    </>}
                </div>}
                <div className="img-wrap" onClick={songInfo}>
                    <div className="loader skeleton-loader">
                        <img src={image} alt={name} />
                    </div>
                </div>
                <div className="metadata">
                    <div className="wrap">
                        <div className="name">{name}</div>
                        <div className="artist">{artist}</div>
                    </div>
                </div>
                <span className="time">{parseTime(parseInt(data.duration))}</span>
                <Tippy content={favorite ? "Remove from Favorites" : "Add to favorite"}><div className="button" onClick={(favorite ? removeSongFromLibrary : addSongToLibrary)}>{favorite ? <MdFavorite /> : <MdFavoriteBorder />}</div></Tippy>
                <Tippy content="Add to queue"><div className={classNames("button", { hide: playing })} onClick={addSongToQueue}><MdQueueMusic /></div></Tippy>
            </button>
        </div>
    );
}

export default PreviewSong;