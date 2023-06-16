import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../core/app/AppContext';
import "../../styles/Dialog.scss";
import LoadSVG from 'react-loadsvg';
import { toast } from 'react-hot-toast';
import addPlaylist from '../../core/firebase/addPlaylist';

function PlayListCreateDialog() {
    const dialogRef = useRef();
    const { user, setPlayListDialogBox, playlistAutoAdded, setPlaylistAutoAdded, addAsPlayListDialogBox } = useContext(AppContext);

    const [playlistError, setPlayListError] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog) {
            const closeHandle = (e) => {
                dialog.querySelector("form")?.reset?.();
            };

            dialog.addEventListener("close", closeHandle);

            return () => dialog.removeEventListener("close", closeHandle);
        }
    }, [setPlaylistAutoAdded]);

    useEffect(() => {
        console.log(playlistAutoAdded);
    }, [playlistAutoAdded]);

    useEffect(() => {
        if (dialogRef.current) setPlayListDialogBox(dialogRef.current);
    }, [setPlayListDialogBox]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = e.target.elements.playlistName;
        const value = input.value.trim();
        setPlayListError("");

        if (!user) {
            input.focus();
            return setPlayListError("No user token found. Please login and try again.");
        }

        if (!value) {
            input.focus();
            return setPlayListError("Please enter a valid name!");
        }

        setDisabled(true);

        const data = await addPlaylist(user, value, playlistAutoAdded?.songs);
        setDisabled(false);
        if (data.error) {
            input.focus();
            return setPlayListError(data.data);
        }

        setPlaylistAutoAdded(null);
        e.target.reset();
        dialogRef.current.close();
        addAsPlayListDialogBox?.close();

        toast.success(data.data);
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
            <form onSubmit={handleSubmit}>
                <div className="title">Create Playlist</div>
                {playlistAutoAdded?.songs && <p className="infos">After the playlist is created, {Object.keys(playlistAutoAdded.songs).length} song(s) will be added to it.</p>}
                <fieldset disabled={disabled}>
                    <legend>Playlist Name</legend>
                    <input type="text" name="name" id="playlistName" autoComplete="name" autoFocus defaultValue={playlistAutoAdded?.name} required />
                    <div className="error">{playlistError}</div>
                </fieldset>
                <p className="infos">The playlists are accessible to anyone who has the share link.</p>
                <div className="btn">
                    <button type="reset" onClick={() => dialogRef.current?.close()} disabled={disabled}>Cancel</button>
                    <button type="submit" disabled={disabled}>{disabled ? <LoadSVG size="1.2em" stroke={14} color="#727888" /> : "Create"}</button>
                </div>
            </form>
        </dialog>
    );
}

export default PlayListCreateDialog;
