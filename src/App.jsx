import React, { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from './core/firebase/config';
import AppContext from './core/app/AppContext';
import Accounts from 'myoasis-accounts';
import { Route, Routes } from 'react-router-dom';
import AppWindow from './AppWindow';
import axios from 'axios';
import AppData from './core/app/AppData';
import { HAS_MEDIA_SESSION, useMediaSession } from '@mebtte/react-media-session';
import keyValueObjectParse from './core/app/keyValueObjectParse';
import convertHTMLEntities from './core/app/convertHTMLEntities';

function App() {
    const [user, userLoading, userError] = useAuthState(firebase.auth);

    const [contentHome, setContentHome] = useState(null);

    const [playerSong, setPlayerSong] = useState(null);

    const [playerList, updatePlayerList] = useState(null);
    const [playerIndex, updatePlayerIndex] = useState(-1);

    const [playerElement, setPlayerElement] = useState(null);

    const [playerExtended, setPlayerExtended] = useState(false);

    const [settings, setSettings] = useState(() => {
        if (window.localStorage) {
            const saved = window.localStorage.getItem(AppData.storage);
            if (saved) try {
                const parsed = JSON.parse(saved);
                return {
                    quality: 4,
                    volume: 1,
                    muted: false,
                    ...parsed,
                };
            } catch (error) { console.error(error); }
        }
        return {};
    });

    useEffect(() => {
        if (!userLoading) window.loadingOverlayRemove();
    }, [userLoading]);

    useEffect(() => {
        if (userError) console.error(userError);
    }, [userError]);

    const updateSettings = async (key, value) => {
        const preload = keyValueObjectParse(settings, key, value);
        setSettings(old => ({ ...old, ...preload }));
    };

    useEffect(() => {
        axios.get(AppData.apiPath.home).then((data) => {
            setContentHome(data.data.data);
            console.log(data.data.data);
        }).catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        window.localStorage?.setItem(AppData.storage, JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        if (playerSong) {
            let name = "";
            if (playerSong) name += convertHTMLEntities(playerSong.name) + " • " + convertHTMLEntities(playerSong.primaryArtists) + " • ";

            name += AppData.name;
            window.document.title = name;
        }
    }, [playerSong]);

    useEffect(() => {
        console.log(playerList, playerIndex);
        const newSong = playerList?.[playerIndex];
        if (newSong) {
            if (playerSong?.id !== newSong.id) {
                setPlayerSong(newSong);
            }
        } else {
            setPlayerSong(null);
        }
    }, [playerIndex, playerList, playerSong]);

    const context = {
        user,
        userLoading,

        playerList,
        playerIndex,

        playerSong,

        contentHome,

        updatePlayerList,
        updatePlayerIndex,

        playerElement,
        setPlayerElement,

        settings,
        updateSettings,

        playerExtended,
        setPlayerExtended
    };

    return (
        <AppContext.Provider value={context}>
            {HAS_MEDIA_SESSION && playerSong && playerElement && <MediaSessionHook />}
            <Routes>
                <Route path="/accounts/*" element={<Accounts />} />
                <Route path="/*" element={<AppWindow />} />
            </Routes>
        </AppContext.Provider>
    )
}

export default App;

function MediaSessionHook() {

    const { playerList, playerIndex, playerSong: song, playerElement: player, updatePlayerIndex } = useContext(AppContext);

    useMediaSession({
        title: convertHTMLEntities(song.name) + " • " + AppData.name,
        artist: convertHTMLEntities(song.primaryArtists),
        album: convertHTMLEntities(song.album?.name),
        onPlay() {
            try { player.play() } catch (error) { console.error(error) }
        },
        onPause() {
            player.pause();
        },
        onPreviousTrack: playerList?.[playerIndex - 1] && (() => {
            player.pause();
            updatePlayerIndex(old => --old);
        }),
        onNextTrack: playerList?.[playerIndex + 1] && (() => {
            player.pause();
            updatePlayerIndex(old => ++old);
        }),
        onSeekBackward: (...x) => { console.log(x); },
        onSeekForward: (...x) => { console.log(x); },
        artwork: song.image.map(img => ({ src: img.link, type: "image/jpg", sizes: img.quality })),
    });

    return null;
}