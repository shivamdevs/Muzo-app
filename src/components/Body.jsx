import React, { useContext } from 'react';
import AppContext from '../core/app/AppContext';
import "../styles/Body.scss";
import PlayerExtension from './player/PlayerExtension';
import { Routes, Route } from 'react-router-dom';
import HomeBody from './home/HomeBody';
import classNames from 'classnames';

function Body() {

    const { playerExtended } = useContext(AppContext);
    return (
        <div id="body" className={classNames({ subExtend: playerExtended })}>
            <div className="home-content">
                <Routes>
                    <Route path="/" element={<HomeBody />} exact />
                </Routes>
            </div>
            <PlayerExtension />
        </div>
    );
}

export default Body;