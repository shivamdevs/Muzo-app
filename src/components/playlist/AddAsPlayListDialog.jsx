import React, { useContext, useEffect, useRef } from 'react';
import AppContext from '../../core/app/AppContext';
import "../../styles/Dialog.scss";
import { toast } from 'react-hot-toast';
import { addToPlaylist } from '../../core/firebase/addPlaylist';
import { MdAdd, MdOutlinePlaylistAdd } from 'react-icons/md';

function AddAsPlayListDialog() {
    const dialogRef = useRef();
    const { setAddAsPlayListDialogBox, playListDialogBox, playlistAutoAdded, setPlaylistAutoAdded, userCDbPlayLists } = useContext(AppContext);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog) {

            const closeHandle = (e) => {
                setPlaylistAutoAdded(null);
            };

            dialog.addEventListener("close", closeHandle);

            return () => dialog.removeEventListener("close", closeHandle);
        }
    }, [setPlaylistAutoAdded]);


    useEffect(() => {
        if (dialogRef.current) setAddAsPlayListDialogBox(dialogRef.current);
    }, [setAddAsPlayListDialogBox]);

    const handleAddition = async (list) => {

        const cached = toast.loading(`Adding songs to ${list.name}...`);

        const songs = { ...(playlistAutoAdded?.songs || {}) };

        dialogRef.current.close();

        const data = await addToPlaylist(list, songs);
        if (data.error) {
            return toast.error(data.error, { id: cached });
        }

        toast.success(data.data, { id: cached });
    };

    const handleOuterClick = (e) => {
        const dialog = dialogRef.current;
        const dialogDimensions = dialog.getBoundingClientRect()
        if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
            e.preventDefault();
            dialog.close();
        }
    };
    return (
        <dialog ref={dialogRef} onClick={handleOuterClick}>
            <div className="form">
                <div className="title">Add to Playlist</div>
                {playlistAutoAdded?.songs && <p className="infos">Select a playlist, then {Object.keys(playlistAutoAdded.songs).length} song(s) will be added to it.</p>}
                <div className="add-to-playlist">
                    <button type="button" onClick={() => playListDialogBox?.showModal()}><MdAdd /> Create new Playlist</button>
                    {userCDbPlayLists?.map((list, index) => <button type="button" onClick={() => handleAddition(list)} key={`${list?.id}${index}`}><MdOutlinePlaylistAdd /> {list.name}</button>)}
                </div>
                <div className="btn">
                    <button type="reset" onClick={() => dialogRef.current?.close()}>Cancel</button>
                </div>
            </div>
        </dialog>
    );
}

export default AddAsPlayListDialog;
