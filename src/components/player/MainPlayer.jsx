import React, { useContext, useEffect, useRef, useState } from 'react';
import "../../styles/Player.scss";
import AppContext from '../../core/app/AppContext';
import { GiNextButton, GiPauseButton, GiPlayButton, GiPreviousButton } from 'react-icons/gi';
import { ImShuffle, ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im';
import { MdQueueMusic } from 'react-icons/md';
import { OasisMenu, OasisMenuBreak, OasisMenuItem, OasisMenuTrigger } from 'oasismenu';
import AppLogo from '../icons/AppLogo';

function parseTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600).toFixed(0);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60).toFixed(0);
    let seconds = (totalSeconds % 60).toFixed(0);

    return ((hours > 0) ? String(hours).padStart(2, "0") + ':' : '') + (hours > 0 ? String(minutes).padStart(2, "0") : minutes) + ':' + String(seconds).padStart(2, "0");
};


function MainPlayer() {
    const player = useRef();

    const { playerList, playerIndex, updatePlayerList, updatePlayerIndex } = useContext(AppContext);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [bufferedPercentage, setBufferedPercentage] = useState(0);

    useEffect(() => {
        if (playerList && playerIndex > -1) {
            player.current.src = playerList[playerIndex].downloadUrl.at(-1).link;
            try {
                if (player.current.paused) player.current.play();
            } catch (error) { console.error(error); }
        }
    }, [playerIndex, playerList]);


    const handleBufferProgress = () => {
        if (player.current.buffered.length > 0) {
            const bufferedEnd = player.current.buffered.end(player.current.buffered.length - 1);
            const bufferedPercentage = (bufferedEnd / duration) * 100;
            setBufferedPercentage(bufferedPercentage);
        }
    };

    const pCEnded = () => {
        if (playerList && playerIndex > -1 && playerList[playerIndex + 1]) updatePlayerIndex(old => ++old);
    };
    const pCProgress = () => {
        handleBufferProgress();
    };
    const pCTimeUpdate = () => {
        setCurrentTime(player.current.currentTime);
    };

    const pCDurationChange = () => {
        setDuration(player.current.duration);
    };

    const pCPrevious = () => {
        if (playerList && playerIndex > -1 && playerList[playerIndex - 1]) updatePlayerIndex(old => --old);
    };
    const pCPlayPause = () => {
        if (player.current.paused) {
            try { player.current.play(); } catch (error) { console.error(error); }
        } else {
            player.current.pause();
        }
    };
    const pCNext = () => {
        if (playerList && playerIndex > -1 && playerList[playerIndex + 1]) updatePlayerIndex(old => ++old);
    };
    const pCMuter = () => {
        player.current.muted = !player.current.muted;
    };
    const pCShuffle = () => {
        updatePlayerList(old => {
            const list = [...old];
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
            return list;
        });
        updatePlayerIndex(0);
    };

    const pCSeek = ({ target }) => {
        player.current.currentTime = (target.value / 100) * duration;
    };

    const [seekDefaultStatePlaying, setSeekDefaultStatePlaying] = useState(false);
    const pCSeekStart = () => {
        if (!player.current.paused) {
            // player.current.pause();
            setSeekDefaultStatePlaying(true);
            window.addEventListener('mouseup', pCSeekEnd, { once: true });
        }
    };

    const pCSeekEnd = () => {
        if (seekDefaultStatePlaying) {
            setSeekDefaultStatePlaying(false);
            try { player.current.play(); } catch (error) { console.error(error); }
        }
    };

    const currentSong = playerList?.[playerIndex];

    return (
        <main id="player">
            <audio
                ref={player}
                onEnded={pCEnded}
                onTimeUpdate={pCTimeUpdate}
                onDurationChange={pCDurationChange}
                onProgress={pCProgress}
            />
            <div className="seek">
                <div className="times">{parseTime(currentTime)}</div>
                <div className="seeker">
                    <div className="buffer" style={{ "--buffered": `${bufferedPercentage.toFixed(2)}%` }} />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={((currentTime / duration) * 100).toFixed(1)}
                        onChange={pCSeek}
                        onMouseDown={pCSeekStart}
                        style={{ "--progress": `${(currentTime / duration * 100).toFixed(1)}%` }}
                    />
                </div>
                <div className="times">{parseTime(duration)}</div>
            </div>
            <div className="flexbox">
                <div className="thumbnail">
                    <div className="cover" style={{ backgroundImage: `url(${currentSong?.image.find(item => item.quality === "50x50").link})` }}></div>
                    <div className="metadata">
                        <div className="name">{currentSong?.name}</div>
                        <div className="artist">{currentSong?.primaryArtists}</div>
                    </div>
                </div>
                <div className="controls">
                    <button type="button" disabled={(!playerList || !playerList[playerIndex - 1])} className="switch" onClick={pCPrevious}><GiPreviousButton /></button>
                    <button type="button" disabled={(!playerList)} className="switch state" onClick={pCPlayPause}>{player.current?.paused ? <GiPlayButton /> : <GiPauseButton />}</button>
                    <button type="button" disabled={(!playerList || !playerList[playerIndex + 1])} className="switch" onClick={pCNext}><GiNextButton /></button>
                </div>
                <div className="opts">
                    <button type="button" className="switch" onClick={pCMuter}>{player.current?.muted ? <ImVolumeMute2 /> : <ImVolumeMedium />}</button>
                    <button type="button" className="switch shuffle" onClick={pCShuffle}><ImShuffle /></button>
                    <OasisMenuTrigger name="player-queue" trigger="click" toggle placement="top-right" shiftDistance={50}>
                        <button type="button" className="switch queue"><MdQueueMusic /></button>
                    </OasisMenuTrigger>
                    <OasisMenu name="player-queue" className="player-queue-oasis">
                        <div className="queue-topic">Queue ({playerList?.length})</div>
                        {playerList?.map((song, index) => <>
                            <OasisMenuBreak />
                            <OasisMenuItem
                                onClick={() => updatePlayerIndex(index)}
                                key={song.id}
                                content={song.name}
                                after={parseTime(parseInt(song.duration))}
                                icon={<div className="image" data-playing={currentSong?.id === song.id}>
                                    <img src={song.image.find(item => item.quality === "50x50").link} alt={song.name} />
                                    <span>{currentSong?.id === song.id ? <AppLogo size={40} /> : <GiPlayButton />}</span>
                                </div>}
                            />
                        </>)}
                    </OasisMenu>
                </div>
            </div>
        </main>
    );
}

export default MainPlayer;