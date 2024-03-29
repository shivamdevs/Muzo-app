import 'oasismenu/themes/space.css';
import "../../styles/Player.scss";
import LoadSVG from 'react-loadsvg';
import { SlOptions } from 'react-icons/sl';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineFileDownload, MdOutlineHighQuality, MdQueueMusic, MdReplay } from 'react-icons/md';
import { HiOutlineDownload } from 'react-icons/hi';
import AppContext from '../../core/app/AppContext';
import shuffleArray from '../../core/app/shuffleArray';
import { OasisMenu, OasisMenuBreak, OasisMenuItem, OasisMenuTrigger } from 'oasismenu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImShuffle, ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im';
import { GiNextButton, GiPauseButton, GiPlayButton, GiPreviousButton } from 'react-icons/gi';
import parseTime from "../../core/app/parseTime";
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import PlayerQueue from './PlayerQueue';
import getFileContentSize from '../../core/app/getFileContentSize';
import downloadSongFromLink from '../../core/app/downloadSongFromLink';
import Tippy from '@tippyjs/react';
import AddRemoveFavorite from '../user/AddRemoveFavorite';
import { useNavigate } from 'react-router-dom';


function MainPlayer() {
    const player = useRef();

    const [playerIsEnded, setPlayerIsEnded] = useState(false);

    const { user, userLoading, playerSong, playerList, playerIndex, updatePlayerSong, updatePlayerList, updatePlayerIndex, setPlayerElement, settings, updateSettings, playerExtended, setPlayerExtended, userCDbFavorites } = useContext(AppContext);

    const [duration, setDuration] = useState(0);
    const [buffering, setBuffering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [bufferedPercentage, setBufferedPercentage] = useState(0);
    const [playerDownloadLink, setPlayerDownloadLink] = useState(null);
    const [seekDefaultStatePlaying, setSeekDefaultStatePlaying] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && playerSong) {
            const pl = player.current;
            const downloads = playerSong.downloadUrl;
            let quality = Number.isNaN(settings.quality) ? 0 : (parseInt(settings.quality) || 0);
            if (quality > 4 || quality < 0) quality = 0;
            pl.src = (downloads[quality]).link;
            const update = pl.dataset.update;
            if (update) {
                pl.currentTime = parseFloat(update);
                delete pl.dataset.update;
            } else {
                try { if (pl.paused) pl.play(); } catch (error) { console.error(error); }
            }
        }
    }, [playerSong, settings.quality, user, userLoading]);

    useEffect(() => {
        player.current && setPlayerElement(player.current);
    }, [setPlayerElement]);

    useEffect(() => {
        if (player.current) {
            player.current.volume = (parseInt(settings.volume * 10) || 10) / 10;
            player.current.muted = Boolean(settings.muted);
        }
    }, [settings.muted, settings.volume]);

    useEffect(() => {
        const result = ["320", "160", "96", "48", "12"].map(byte => ({
            key: `${byte}kbps`,
            name: `Download ${byte}kbps`,
            after: null,
            link: null,
            download: null
        }));
        if (playerSong) {
            [...playerSong.downloadUrl].reverse().forEach(async (download, index) => {
                result[index].download = `[Muzo]-${convertHTMLEntities(playerSong.name)}-${download.quality}.${download.link.split(".").at(-1)}`
                result[index].link = download.link;
                result[index].after = await getFileContentSize(download.link);
            })
            setPlayerDownloadLink(result);
        } else {
            setPlayerDownloadLink(null);
        }
    }, [playerSong]);

    const updateAudioQuality = (quality) => {
        const current = player.current.currentTime;
        updateSettings("quality", quality);
        player.current.addEventListener("loadeddata", () => player.current.currentTime = current, { once: true });
    };

    const skQ = useRef();
    const skO = useRef();
    const skD = useRef();

    useEffect(() => {
        const playerElement = player.current;
        const keyBinds = (e) => {

            if (["INPUT", "BUTTON", "DIALOG"].includes(e.target.nodeName) || !playerElement) return;

            const key = e.keyCode || e.which;
            switch (key) {
                case 32: // Space
                    if (playerElement.paused) {
                        try { playerElement.play(); } catch (err) { console.error(err); }
                    } else {
                        playerElement.pause();
                    }
                    break;
                case 77: // M
                    updateSettings("muted", muted => !muted);
                    break;
                // case 81: // Q
                //     skQ.current?.click();
                //     break;
                // case 68: // D
                //     skD.current?.click();
                //     break;
                // case 79: // O
                //     skO.current?.click();
                //     break;
                case 83: // S
                    updatePlayerList(old => shuffleArray([...old]));
                    player.current.pause();
                    updatePlayerIndex(0);
                    break;
                case 78: // N
                    if (playerList && playerList[playerIndex + 1]) { player.current.pause(); updatePlayerIndex(old => ++old); }
                    break;
                case 80: // P
                    if (playerList && playerList[playerIndex - 1]) { player.current.pause(); updatePlayerIndex(old => --old); }
                    break;
                case 70: // F
                    setPlayerExtended(ext => !ext);
                    break;
                default:
                    console.log(key);
                    return;
            }
            e.preventDefault();
        };
        window.addEventListener("keydown", keyBinds);
        return () => window.removeEventListener("keydown", keyBinds);
    }, [playerIndex, playerList, setPlayerExtended, updatePlayerIndex, updatePlayerList, updateSettings]);

    return (
        <main id="player">
            <audio
                ref={player}
                onWaiting={() => setBuffering(true)}
                onCanPlay={() => setBuffering(false)}
                onLoadedData={() => setBuffering(false)}
                onPlaying={() => setPlayerIsEnded(false)}
                onDurationChange={() => setDuration(player.current.duration)}
                onTimeUpdate={() => setCurrentTime(player.current.currentTime)}
                onEnded={() => {
                    if (playerList && playerList[playerIndex + 1]) {
                        player.current.pause();
                        updatePlayerIndex(old => ++old);
                    } else {
                        setPlayerIsEnded(true);
                    }
                }}
                onError={(error) => {
                    setBuffering(false);
                    console.error(error);
                }}
                onProgress={() => {
                    if (player.current.buffered.length > 0) {
                        const bufferedEnd = player.current.buffered.end(player.current.buffered.length - 1);
                        const bufferedPercentage = (bufferedEnd / duration) * 100;
                        setBufferedPercentage(bufferedPercentage);
                    }
                }}
            />
            <div className="seek">
                <Tippy content="Elapsed"><div className="times">{parseTime(currentTime)}</div></Tippy>
                <div className="seeker">
                    <div className="buffer" style={{ "--buffered": `${bufferedPercentage.toFixed(2)}%` }} />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        disabled={(!playerList)}
                        onError={(error) => console.error(error)}
                        value={((currentTime / (duration || 1)) * 100).toFixed(1)}
                        style={{ "--progress": `${(currentTime / (duration || 1) * 100).toFixed(1)}%` }}
                        onChange={({ target }) => {
                            player.current.currentTime = (target.value / 100) * duration;
                        }}
                        onMouseDown={() => {
                            if (!player.current.paused) {
                                // player.current.pause();
                                setSeekDefaultStatePlaying(true);
                                window.addEventListener('mouseup', () => {
                                    if (seekDefaultStatePlaying && player.current.paused) { setSeekDefaultStatePlaying(false); try { player.current.play() } catch (error) { console.error(error) } }
                                }, { once: true });
                            }
                        }}
                    />
                </div>
                <Tippy content="Duration"><div className="times">{parseTime(duration)}</div></Tippy>
            </div>
            <div className="flexBox">
                <div className="thumbnail">
                    <div className="cover" style={{ backgroundImage: `url(${playerSong?.image.find(item => item.quality === "50x50").link})` }}>
                        <AddRemoveFavorite song={playerSong} user={user} favorites={userCDbFavorites} className="switch" />
                    </div>
                    <div className="metadata">
                        <div className="meta-cover">
                            <div className="name">{convertHTMLEntities(playerSong?.name)}</div>
                            <div className="artist">{convertHTMLEntities(playerSong?.primaryArtists)}</div>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <Tippy content="Previous">
                        <button type="button" className="switch" disabled={(!playerList || !playerList[playerIndex - 1])} onClick={() => {
                            if (playerList && playerList[playerIndex - 1]) { player.current.pause(); updatePlayerIndex(old => --old); }
                        }}><GiPreviousButton /></button>
                    </Tippy>
                    <Tippy content={(playerIsEnded ? "Replay" : player.current?.paused ? "Play" : "Pause") + " (Space)"}>
                        <button type="button" className="switch state" disabled={(!playerList)} onClick={() => {
                            if (playerIsEnded) {
                                playerList && updatePlayerSong(old => ({ ...old }));
                            } else {
                                if (player.current.paused) try { player.current.play() } catch (error) { console.error(error) } else player.current.pause();
                            }
                        }}>
                            {buffering && <LoadSVG size="100%" color="#fff7" duration={2000} />}
                            {playerIsEnded ? <MdReplay /> : player.current?.paused ? <GiPlayButton /> : <GiPauseButton />}
                        </button>
                    </Tippy>
                    <Tippy content="Next">
                        <button type="button" className="switch" disabled={(!playerList || !playerList[playerIndex + 1])} onClick={() => {
                            if (playerList && playerList[playerIndex + 1]) { player.current.pause(); updatePlayerIndex(old => ++old); }
                        }}><GiNextButton /></button>
                    </Tippy>
                </div>
                <div className="opts">
                    <OasisMenuTrigger name="player-download" trigger="click" toggle placement="top" shiftDistance={50}>
                        <Tippy content="Download">
                            <button type="button" ref={skD} className="switch queue" disabled={!(user && playerList)}><HiOutlineDownload /></button>
                        </Tippy>
                    </OasisMenuTrigger>
                    <OasisMenu name="player-download" theme="space" className="player-download-sync">
                        <div className="oasisTopic">Download this song <span style={{ color: "#727888" }}>#{playerSong?.id}</span></div>
                        <OasisMenuBreak />
                        {!playerDownloadLink && <div className="oasisTopic failed">Failed to create download links!</div>}
                        {playerDownloadLink?.map(down => <OasisMenuItem key={down.key} onClick={() => downloadSongFromLink(down.link, down.download)} content={down.name} after={down.after || <LoadSVG color='currentColor' size="1em" />} icon={<MdOutlineHighQuality />} statusIcon={<MdOutlineFileDownload />} />)}
                    </OasisMenu>
                    <Tippy content="Shuffle (S)">
                        <button type="button" className="switch shuffle" disabled={(!playerList)} onClick={() => {
                            updatePlayerList(old => shuffleArray([...old]));
                            player.current.pause();
                            updatePlayerIndex(0);
                        }}><ImShuffle /></button>
                    </Tippy>
                    <OasisMenuTrigger name="player-queue" trigger="click" toggle placement="top" shiftDistance={50}>
                        <Tippy content="Queue">
                            <button type="button" ref={skQ} className="switch queue" disabled={(!playerList)}><MdQueueMusic /></button>
                        </Tippy>
                    </OasisMenuTrigger>
                    <OasisMenu name="player-queue" theme="space" className="player-queue-oasis">
                        <PlayerQueue playerList={playerList} playerIndex={playerIndex} playerElement={player.current} user={user} userCDbFavorites={userCDbFavorites} updatePlayerList={updatePlayerList} updatePlayerIndex={updatePlayerIndex} setPlayerExtended={setPlayerExtended} />
                    </OasisMenu>
                    <Tippy content={(settings.muted ? "Unmute" : "Mute") + " (M)"}>
                        <button type="button" className="switch" disabled={(!playerList)} onClick={() => updateSettings("muted", muted => !muted)}>{settings.muted ? <ImVolumeMute2 /> : <ImVolumeMedium />}</button>
                    </Tippy>
                    <div className="seeker volume">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={settings.volume}
                            disabled={(!playerList || settings.muted)}
                            onChange={({ target }) => {
                                updateSettings("volume", target.value);
                            }}
                            style={{ "--progress": `${(settings.volume * 100).toFixed(1)}%` }}
                        />
                    </div>
                    <OasisMenuTrigger name="player-options" trigger="click" toggle placement="top-right" shiftDistance={50}>
                        <Tippy content="More">
                            <button type="button" ref={skO} className="switch" disabled={(!playerList)}><SlOptions /></button>
                        </Tippy>
                    </OasisMenuTrigger>
                    <OasisMenu name="player-options" theme="space">
                        <OasisMenuItem onClick={() => navigate(`/songs/${playerSong?.id}`)} content="Song info" icon={<BsInfoCircle />} />
                        <OasisMenuBreak />
                        <div className="oasisTopic">Audio Quality</div>
                        <OasisMenuItem icon={<MdOutlineHighQuality />} disabled={!user} onClick={() => updateAudioQuality(4)} checked={settings.quality === 4} content="Extreme" after="320kbps" />
                        <OasisMenuItem icon={<MdOutlineHighQuality />} disabled={!user} onClick={() => updateAudioQuality(3)} checked={settings.quality === 3} content="Best" after="160kbps" />
                        <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(2)} checked={settings.quality === 2} content="Good" after="96kbps" />
                        <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(1)} checked={settings.quality === 1} content="Fair" after="48kbps" />
                        <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(0)} checked={settings.quality === 0} content="Low" after="12kbps" />
                    </OasisMenu>
                    <Tippy content={(playerExtended ? "Exit fullscreen" : "Fullscreen") + " (F)"}>
                        <button type="button" className="switch" disabled={(!playerList)} onClick={() => setPlayerExtended(ext => !ext)}>
                            {playerExtended ? <FaCompressAlt /> : <FaExpandAlt />}
                        </button>
                    </Tippy>
                </div>
            </div>
        </main >
    );
}

export default MainPlayer;
