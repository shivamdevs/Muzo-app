import React from 'react';
import "./styles/App.scss";
import Header from './components/Header';
import MainPlayer from './components/player/MainPlayer';
import Body from './components/Body';

function AppWindow() {
    return (
        <section id="main">
            <Header />
            <Body />
            <MainPlayer />
        </section>
    );
}

export default AppWindow;