import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from './core/firebase/config';
import AppContext from './core/app/AppContext';
import AppWindow from './AppWindow';
import axios from 'axios';
import AppData from './core/app/AppData';
import { HAS_MEDIA_SESSION, useMediaSession } from '@mebtte/react-media-session';
import keyValueObjectParse from './core/app/keyValueObjectParse';
import convertHTMLEntities from './core/app/convertHTMLEntities';

function App() {
    const [user, userLoading, userError] = useAuthState(firebase.auth);
    // Set a ref to prevent rerendering of elements
    const previousSavedData = useRef();
    // Define all states that are to be used
    const [playerSong, updatePlayerSong] = useState(null);
    const [contentHome, setContentHome] = useState(null);
    const [playerList, updatePlayerList] = useState(null);
    const [playerIndex, updatePlayerIndex] = useState(-1);
    const [playerElement, setPlayerElement] = useState(null);
    const [playerExtended, setPlayerExtended] = useState(false);
    const [playerQuerySearch, setPlayerQuerySearch] = useState("");
    const [userCDbPlayLists, setUserCDbPlayLists] = useState(null);
    const [userCDbFavorites, setUserCDbFavorites] = useState(null);
    // Fetch user settings from the local storage
    const [settings, setSettings] = useState(() => {
        if (window.localStorage) {
            const saved = window.localStorage.getItem(AppData.storage);
            if (saved) try {
                const parsed = JSON.parse(saved);
                return {
                    quality: 4,
                    volume: 1,
                    muted: false,
                    languages: [],
                    ...parsed,
                };
            } catch (error) { console.error(error); }
        }
        return {};
    });

    useEffect(() => {
        window.loadingOverlayRemove();
    }, []);

    useEffect(() => {
        if (userError) console.error(userError);
    }, [userError]);

    const updateSettings = useCallback(async (key, value) => {
        const preload = keyValueObjectParse(settings, key, value);
        console.log(preload);
        setSettings(old => ({ ...old, ...preload }));
    }, [settings]);

    useEffect(() => {
        if (!userLoading && !user) {
            if (settings.quality > 2) updateSettings("quality", 2);
        }
    }, [settings.quality, updateSettings, user, userLoading]);

    useEffect(() => {
        axios.get(AppData.apiPath.home + (settings.languages?.length ? "," + settings.languages.join(",") : "")).then((data) => {
            setContentHome(data.data.data);
        }).catch((error) => console.error(error));
    }, [settings.languages]);

    useEffect(() => {
        window.localStorage?.setItem(AppData.storage, JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        let name = "";
        if (playerSong) name += convertHTMLEntities(playerSong.name) + " • " + convertHTMLEntities(playerSong.primaryArtists) + " • ";
        name += AppData.name;
        window.document.title = name;
    }, [playerSong]);

    useEffect(() => {
        console.log(playerIndex, playerList);
        const newSong = playerList?.[playerIndex];
        if (newSong) {
            if (playerSong?.id !== newSong.id) {
                updatePlayerSong(newSong);
            }
        } else {
            updatePlayerSong(null);
        }
    }, [playerIndex, playerList, playerSong]);

    useEffect(() => {
        if (window.localStorage && !previousSavedData.current && playerElement) {
            const bucket = window.localStorage.getItem(AppData.bucket);
            if (bucket) {
                try {
                    const parsed = JSON.parse(bucket);
                    parsed && parsed.songs && Array.isArray(parsed.songs) ? axios.get(`${AppData.api}/songs?id=${parsed.songs}`).then((result) => {
                        const songs = result.data.data;
                        if (songs.length) {
                            const songIndex = !(parsed.song && Array.isArray(parsed.song)) ? 0 : songs.findIndex(item => item.id === parsed.song[0]);
                            updatePlayerIndex(songIndex > -1 ? songIndex : 0);
                            updatePlayerList(songs);
                            if (!Number.isNaN(parsed.song[1])) playerElement.dataset.update = parsed.song[1];
                        }
                    }).catch((err) => {
                        console.error(err);
                    }).finally(() => {
                        previousSavedData.current = "found";
                    }) : previousSavedData.current = "not-found";
                } catch (error) { console.error(); }
            }
        }
    }, [contentHome, playerElement]);

    useEffect(() => {
        if (window.localStorage && playerSong && playerElement) {
            const player = playerElement;
            const autoTimeLogger = () => {
                if (playerList) {
                    const bucket = {
                        songs: playerList.map(song => song.id),
                        song: [
                            playerSong.id,
                            player.currentTime,
                        ],
                    };
                    window.localStorage.setItem(AppData.bucket, JSON.stringify(bucket));
                } else {
                    window.localStorage.removeItem(AppData.bucket);

                }
            };
            player.addEventListener('timeupdate', autoTimeLogger);

            return () => player.removeEventListener('timeupdate', autoTimeLogger);
        }
    }, [playerElement, playerList, playerSong]);

    const context = {
        user,
        userLoading,

        playerList,
        playerIndex,

        playerSong,
        updatePlayerSong,

        contentHome,

        updatePlayerList,
        updatePlayerIndex,

        playerElement,
        setPlayerElement,

        settings,
        updateSettings,

        userCDbPlayLists,
        setUserCDbPlayLists,

        userCDbFavorites,
        setUserCDbFavorites,

        playerQuerySearch,
        setPlayerQuerySearch,

        playerExtended,
        setPlayerExtended
    };

    return (
        <AppContext.Provider value={context}>
            {HAS_MEDIA_SESSION && playerSong && playerElement && <MediaSessionHook />}
            {user && <HookUserData
                user={user}
                playlist={setUserCDbPlayLists}
                favorites={setUserCDbFavorites}
            />}
            <AppWindow />
        </AppContext.Provider>
    )
}

export default App;

function HookUserData({ user, playlist, favorites }) {
    const [userData, , userDataError] = useDocument(doc(firebase.store, "muzo", user.uid));

    useEffect(() => {
        userDataError && console.error(userDataError);
    }, [userDataError]);

    const sortFavorites = useCallback(async (data) => {
        if (data.doc.exists && data.favorites) {
            const idArray = Object.entries(data.favorites)?.filter(item => item[1])?.sort((a, b) => a[1] - b[1])?.map(item => item[0])?.sort();
            const ids = (idArray || [])?.join(",");
            if (ids) {
                axios.get(`${AppData.api}/songs?id=${ids}`).then((result) => {
                    const forward = result.data.data;
                    const newFav = [];
                    for (const fav of idArray) {
                        const favF = forward.find(favJ => favJ.id === fav);
                        favF && newFav.push(favF);
                    }
                    favorites(newFav);
                }).catch((err) => {
                    console.error(err);
                });
            }
        } else {
            favorites(null);
        }
    }, [favorites]);

    useEffect(() => {
        if (userData) {
            const data = {
                ...(userData.data() || {}),
                doc: {
                    exists: userData.exists(),
                    ref: userData.ref,
                    org: userData,
                    id: userData.id
                },
            };
            sortFavorites(data);

        } else {
            playlist(null);
        }
    }, [playlist, sortFavorites, userData]);

    return null;
}

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
        // onSeekBackward: (...x) => { console.log(x); },
        // onSeekForward: (...x) => { console.log(x); },
        artwork: song.image.map(img => ({ src: img.link, type: "image/jpg", sizes: img.quality })),
    });

    return null;
}