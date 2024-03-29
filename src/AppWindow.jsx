import React, { useContext, useEffect } from 'react';
import "./styles/App.scss";
import Header from './components/Header';
import MainPlayer from './components/player/MainPlayer';
import Body from './components/Body';
import AppContext from './core/app/AppContext';
import PlayListCreateDialog from './components/playlist/PlayListCreateDialog';
import AddAsPlayListDialog from './components/playlist/AddAsPlayListDialog';

function AppWindow() {
    const { playerSong } = useContext(AppContext);

    useEffect(() => {
        const root = window.document.querySelector("#root");
        if (root) root.style.backgroundImage = `url(${playerSong?.image[2].link})`;
    }, [playerSong?.image]);

    return (
        <section id="main">
            <Header />
            <Body />
            <MainPlayer />
            <PlayListCreateDialog />
            <AddAsPlayListDialog />
        </section>
    );
}

export default AppWindow;