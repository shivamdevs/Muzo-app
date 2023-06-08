import React, { useEffect, useRef } from 'react';
import "../../styles/PlayerQueue.scss";
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import { MdOutlineClear } from 'react-icons/md';
import parseTime from '../../core/app/parseTime';
import { GiPlayButton } from 'react-icons/gi';
import SongPlaying from '../icons/SongPlaying';
import { VscClearAll } from 'react-icons/vsc';
import Tippy from '@tippyjs/react';

function PlayerQueue({ playerList, playerIndex, playerElement, updatePlayerList, updatePlayerIndex, playerExtended, setPlayerExtended }) {

    if (!playerList) return null;


    return (
        <div className="player-queue">
            <header>
                <div className="title">Queue</div>
                <Tippy placement="left" content="Clear queue">
                    <button type="button" onClick={() => {
                        updatePlayerList(null);
                        playerElement.pause();
                        updatePlayerIndex(-1);
                        playerElement.src = null;
                        setPlayerExtended(false);
                    }}><VscClearAll /></button>
                </Tippy>
            </header>
            <div className="list">
                {playerList.map((player, index) => <QueueItem
                    key={player.id}
                    song={player}
                    index={index}
                    playing={index === playerIndex}
                    count={`${index + 1}`.padStart(`${playerList.length}`.length, '0')}
                    playerIndex={playerIndex}
                    playerExtended={playerExtended}
                    updatePlayerList={updatePlayerList}
                    updatePlayerIndex={updatePlayerIndex}
                    playerElement={playerElement}
                />)}
            </div>
        </div>
    );
}

export default PlayerQueue;

function QueueItem({ song, count, playing, index, playerExtended, playerElement, updatePlayerList, playerIndex, updatePlayerIndex }) {
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
            playerElement.pause();
            updatePlayerIndex(index)
        }}>
            <div className="count-play">
                {playing ? <SongPlaying /> : <>
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
            {!playing && <Tippy content="Remove" placement="left"><button type="button" className="clear" onClick={deleteSong}><MdOutlineClear /></button></Tippy>}
            <div className="opts">
                <span className="time">{parseTime(parseInt(song.duration))}</span>
            </div>
        </div>
    );
}