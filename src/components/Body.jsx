import React, { useContext, useEffect, useRef } from 'react';
import AppContext from '../core/app/AppContext';
import "../styles/Body.scss";
import PlayerExtension from './player/PlayerExtension';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomeBody from './home/HomeBody';
import classNames from 'classnames';
import ShowAllSongs from './collection/ShowAllSongs';
import Footer from './Footer';
import SideBar from './SideBar';
import Search from './pages/Search';
import Accounts from 'myoasis-accounts';
import Favorites from './pages/Favorites';


function Body() {
    const bodyRef = useRef();
    const location = useLocation();

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = 0;
        }
    }, [location]);

    const { user, userLoading, playerExtended, contentHome } = useContext(AppContext);
    return (
        <div id="body" className={classNames({ subExtend: playerExtended, hasSidebar: user })}>
            <SideBar />
            <div className="home-content" ref={bodyRef}>
                <Routes>
                    <Route path="/accounts/*" element={<Accounts />} />
                    <Route path="/search" element={<Search />} />
                    {(userLoading || user) && <Route path="/favorites" element={<Favorites />} />}
                    <Route path="/trending" element={<ShowAllSongs data={contentHome?.trending?.songs} dataAdd={contentHome?.trending?.albums} title="Trending" />} />
                    <Route path="/releases" element={<ShowAllSongs data={contentHome?.albums} title="New Releases" />} />
                    <Route path="/playlists" element={<ShowAllSongs data={contentHome?.playlists} title="Hit Playlists" />} />
                    <Route path="/charts" element={<ShowAllSongs data={contentHome?.charts} title="Top Charts" />} />
                    <Route path="/" element={<HomeBody />} exact />
                </Routes>
                <Footer />
            </div>
            <PlayerExtension />
        </div>
    );
}

export default Body;