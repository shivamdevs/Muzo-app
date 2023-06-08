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


function MainPlayer() {
    const player = useRef();

    const [playerIsEnded, setPlayerIsEnded] = useState(false);

    const { user, userLoading, playerSong, playerList, playerIndex, updatePlayerSong, updatePlayerList, updatePlayerIndex, setPlayerElement, settings, updateSettings, playerExtended, setPlayerExtended } = useContext(AppContext);

    const [duration, setDuration] = useState(0);
    const [buffering, setBuffering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [bufferedPercentage, setBufferedPercentage] = useState(0);
    const [playerDownloadLink, setPlayerDownloadLink] = useState(null);
    const [seekDefaultStatePlaying, setSeekDefaultStatePlaying] = useState(false);

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

    const createDownloadLinks = () => {
        if (playerSong) {
            (async () => {
                const result = [];
                for (const download of playerSong.downloadUrl) {
                    const size = await getFileContentSize(download.link);
                    result.push({
                        key: download.quality,
                        name: `Download ${download.quality}`,
                        after: size,
                        link: download.link,
                        download: `[Muzo]-${convertHTMLEntities(playerSong.name)}-${download.quality}.${download.link.split(".").at(-1)}`,
                    });
                }
                setPlayerDownloadLink(result.reverse());
            })();
        } else {
            setPlayerDownloadLink(false);
        }
    };

    const updateAudioQuality = (quality) => {
        const current = player.current.currentTime;
        updateSettings("quality", quality);
        player.current.addEventListener("loadeddata", () => player.current.currentTime = current, { once: true });
    };

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
            <div className="flexbox">
                <div className="thumbnail">
                    <div className="cover" style={{ backgroundImage: `url(${playerSong?.image.find(item => item.quality === "50x50").link})` }} />
                    <div className="metadata">
                        <div className="name">{convertHTMLEntities(playerSong?.name)}</div>
                        <div className="artist">{convertHTMLEntities(playerSong?.primaryArtists)}</div>
                    </div>
                </div>
                <div className="controls">
                    <Tippy content="Previous">
                        <button type="button" className="switch" disabled={(!playerList || !playerList[playerIndex - 1])} onClick={() => {
                            if (playerList && playerList[playerIndex - 1]) { player.current.pause(); updatePlayerIndex(old => --old); }
                        }}><GiPreviousButton /></button>
                    </Tippy>
                    <Tippy content={playerIsEnded ? "Replay" : player.current?.paused ? "Play" : "Pause"}>
                        <button type="button" className="switch state" disabled={(!playerList)} onClick={() => {
                            if (playerIsEnded) {
                                console.log(1);
                                playerList && updatePlayerSong(old => ({...old}));
                            } else {
                                if (player.current.paused) try {player.current.play()} catch (error) {console.error(error)} else player.current.pause();
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
                {user && <>
                    <OasisMenuTrigger name="player-download" trigger="click" toggle placement="top" shiftDistance={50}>
                        <Tippy content="Download">
                            <button type="button" className="switch queue" disabled={(!playerList)}><HiOutlineDownload /></button>
                        </Tippy>
                    </OasisMenuTrigger>
                    <OasisMenu name="player-download" theme="space" onOpen={createDownloadLinks} onClose={() => setPlayerDownloadLink(null)} className="player-download-sync">
                        <div className="oasisTopic">Download this song</div>
                        <OasisMenuBreak />
                        {playerDownloadLink === false && <div className="oasisTopic failed">Failed to create download links!</div>}
                        {playerDownloadLink === null && <div className="loading">
                            <div className="oasisTopic" style={{ marginBottom: "2em" }}>Creating download links...</div>
                            <LoadSVG size={40} />
                        </div>}
                        {playerDownloadLink?.map(down => <OasisMenuItem key={down.key} onClick={() => downloadSongFromLink(down.link, down.download)} content={down.name} after={down.after} icon={<MdOutlineHighQuality />} statusIcon={<MdOutlineFileDownload />} />)}
                    </OasisMenu>
                </>}
                <Tippy content="Shuffle">
                    <button type="button" className="switch shuffle" disabled={(!playerList)} onClick={() => {
                        updatePlayerList(old => shuffleArray([...old]));
                        player.current.pause();
                        updatePlayerIndex(0);
                    }}><ImShuffle /></button>
                </Tippy>
                <OasisMenuTrigger name="player-queue" trigger="click" toggle placement="top" shiftDistance={50}>
                    <Tippy content="Queue">
                        <button type="button" className="switch queue" disabled={(!playerList)}><MdQueueMusic /></button>
                    </Tippy>
                </OasisMenuTrigger>
                <OasisMenu name="player-queue" theme="space" className="player-queue-oasis">
                    <PlayerQueue playerList={playerList} playerIndex={playerIndex} playerElement={player.current} updatePlayerList={updatePlayerList} updatePlayerIndex={updatePlayerIndex} setPlayerExtended={setPlayerExtended} />
                </OasisMenu>
                <Tippy content={settings.muted ? "Unmute" : "Mute"}>
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
                        <button type="button" className="switch" disabled={(!playerList)}><SlOptions /></button>
                    </Tippy>
                </OasisMenuTrigger>
                <OasisMenu name="player-options" theme="space">
                    <div className="oasisTopic">Login for unlock & more</div>
                    <OasisMenuBreak />
                    <OasisMenuItem content="Song info" icon={<BsInfoCircle />} />
                    <OasisMenuBreak />
                    <div className="oasisTopic">Audio Quality</div>
                    <OasisMenuItem icon={<MdOutlineHighQuality />} disabled={!user} onClick={() => updateAudioQuality(4)} checked={settings.quality === 4} content="Extreme" after="320kbps" />
                    <OasisMenuItem icon={<MdOutlineHighQuality />} disabled={!user} onClick={() => updateAudioQuality(3)} checked={settings.quality === 3} content="Best" after="160kbps" />
                    <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(2)} checked={settings.quality === 2} content="Good" after="96kbps" />
                    <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(1)} checked={settings.quality === 1} content="Fair" after="48kbps" />
                    <OasisMenuItem icon={<MdOutlineHighQuality />} onClick={() => updateAudioQuality(0)} checked={settings.quality === 0} content="Low" after="12kbps" />
                </OasisMenu>
                <Tippy content={playerExtended ? "Exit fullscreen" : "Fullscreen"}>
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
