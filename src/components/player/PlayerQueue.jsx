import React, { useEffect, useRef, useState } from 'react';
import "../../styles/PlayerQueue.scss";
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import { MdCheckBox, MdDeleteSweep, MdOutlineCheckBoxOutlineBlank, MdOutlineClear, MdOutlineDeselect, MdOutlineSelectAll, MdSaveAs } from 'react-icons/md';
import parseTime from '../../core/app/parseTime';
import { GiPlayButton } from 'react-icons/gi';
import SongPlaying from '../icons/SongPlaying';
import { VscClearAll } from 'react-icons/vsc';
import Tippy from '@tippyjs/react';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { LuSplitSquareVertical } from 'react-icons/lu';
import AddRemoveFavorite from '../user/AddRemoveFavorite';


function PlayerQueue({ user, playerList, playerIndex, playerElement, updatePlayerList, updatePlayerIndex, playerExtended, setPlayerExtended, userCDbFavorites }) {
    const [editList, updateEditList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!editMode) updateEditList([]);
    }, [editMode]);

    useEffect(() => {
        playerList?.length && updateEditList((old) => {
            return old.filter(song => playerList.find(data => data.id === song));
        });
    }, [playerList]);

    if (!playerList) return null;



    return (
        <div className="player-queue">
            <header>
                <Tippy content={editMode ? "Cancel Edit" : "Edit Queue"}>
                    <button type="button" onClick={() => setEditMode(mode => !mode)}>{editMode ? <MdOutlineClear /> : <IoMdCheckboxOutline />}</button>
                </Tippy>
                <div className="title">{editMode ? `${editList.length} song${editList.length !== 1 ? "s" : ""} selected` : "Queue"}</div>
                {editMode && <>
                    <Tippy content="Select Inverse">
                        <button type="button" onClick={() => {
                            updateEditList(old => playerList.filter(song => !old.includes(song.id)).map(song => song.id));
                        }}><LuSplitSquareVertical /></button>
                    </Tippy>
                    <Tippy content={editList.length === playerList.length ? "Clear Selection" : "Select All"}>
                        <button type="button" onClick={() => {
                            if (editList.length === playerList.length) {
                                updateEditList([]);
                            } else {
                                updateEditList(playerList.map(song => song.id));
                            }
                        }}>{editList.length === playerList.length ? <MdOutlineDeselect /> : <MdOutlineSelectAll />}</button>
                    </Tippy>
                    <Tippy content="Remove Selected">
                        <button type="button" disabled={editList.length === 0} onClick={() => {
                            let reduceIndex = 0;
                            updatePlayerList(old => {
                                const list = [...old];
                                for (let songItem of editList) {
                                    const songIndex = list.findIndex(song => song.id === songItem);
                                    if (playerIndex > songIndex) reduceIndex--;
                                    list.splice(songIndex, 1);
                                }
                                return list;
                            });
                            reduceIndex && updatePlayerIndex(old => {
                                const reduce = old + reduceIndex;
                                if (reduce >= 0) return reduce; else return 0;
                            });
                            setEditMode(false);
                            updateEditList([]);

                        }}><MdDeleteSweep /></button>
                    </Tippy>
                </>}
                {!editMode && <>
                    <Tippy content="Save Queue">
                        <button type="button" disabled={!user} onClick={() => {
                        }}><MdSaveAs /></button>
                    </Tippy>
                    <Tippy content="Clear queue">
                        <button type="button" onClick={() => {
                            updatePlayerList(null);
                            playerElement.pause();
                            updatePlayerIndex(-1);
                            playerElement.src = null;
                            setPlayerExtended(false);
                        }}><VscClearAll /></button>
                    </Tippy>
                </>}
            </header>
            <div className="list">
                {playerList.map((player, index) => <QueueItem
                    key={player.id}
                    song={player}
                    user={user}
                    edit={editMode}
                    count={`${index + 1}`.padStart(`${playerList.length}`.length, '0')}
                    index={index}
                    playing={index === playerIndex}
                    onSelect={updateEditList}
                    selected={editList.includes(player.id)}
                    favorites={userCDbFavorites}
                    playerIndex={playerIndex}
                    playerElement={playerElement}
                    playerExtended={playerExtended}
                    updatePlayerList={updatePlayerList}
                    updatePlayerIndex={updatePlayerIndex}
                />)}
            </div>
        </div>
    );
}

export default PlayerQueue;

function QueueItem({ user, song, edit, count, playing, index, onSelect, selected, playerExtended, playerElement, updatePlayerList, playerIndex, updatePlayerIndex, favorites }) {
    const queueItem = useRef();

    const deleteSong = (e) => {
        e.stopPropagation();
        updatePlayerList(old => {
            const list = [...old];
            list.splice(index, 1);
            return list;
        });
        playerIndex > index && updatePlayerIndex(old => --old);
    };

    useEffect(() => {
        playerExtended && playing && queueItem.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [playerExtended, playing]);
    return (
        <div className="item" ref={queueItem} onClick={() => {
            if (edit) return onSelect(items => {
                const list = [...items];
                if (list.includes(song.id)) {
                    list.splice(list.indexOf(song.id), 1);
                } else {
                    list.push(song.id);
                }
                return list;
            });
            playerElement.pause();
            updatePlayerIndex(index)
        }}>
            <div className="count-play">
                {edit ? (selected ? <MdCheckBox /> : <MdOutlineCheckBoxOutlineBlank />) : playing ? <SongPlaying /> : <>
                    <span className="count">{count}</span>
                    <Tippy content="Play" placement="right">
                        <span className="play"><GiPlayButton /></span>
                    </Tippy>
                </>}
            </div>
            <img src={song.image.find(item => item.quality === "50x50").link} alt={convertHTMLEntities(song.name)} />
            <div className="metadata">
                <div className="wrap">
                    <div className="name">{convertHTMLEntities(song.name)}</div>
                    <div className="artist">{convertHTMLEntities(song.primaryArtists)}</div>
                </div>
            </div>
            {!edit && <>
                <Tippy content="Remove"><button type="button" className="btn clear" onClick={deleteSong}><MdOutlineClear /></button></Tippy>
                <AddRemoveFavorite song={song} user={user} favorites={favorites} />
            </>}
            <div className="opts">
                <span className="time">{parseTime(parseInt(song.duration))}</span>
            </div>
        </div>
    );
}