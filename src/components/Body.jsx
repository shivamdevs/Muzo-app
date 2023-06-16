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
import CollectionPage from './pages/CollectionPage';
import CollectionSong from './pages/CollectionSong';
import PlaylistPage from './pages/PlaylistPage';


function Body() {
    const bodyRef = useRef();
    const location = useLocation();

    const { user, userLoading, playerList, updatePlayerList, playerElement, updatePlayerIndex, updatePlayerSong, playerExtended, setPlayerExtended, contentHome } = useContext(AppContext);
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = 0;
        }
    }, [location]);

    useEffect(() => {
        if (!playerList?.length && playerExtended) setPlayerExtended(false);
        if (playerList && playerList?.length === 0) {
            updatePlayerList(null);
            updatePlayerSong(null);
            updatePlayerIndex(-1);
            playerElement.src = null;
        }
    }, [playerElement, playerExtended, playerList, setPlayerExtended, updatePlayerIndex, updatePlayerList, updatePlayerSong]);

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

                    <Route path="/playlists/up/:code" element={<PlaylistPage />} />

                    <Route path="/albums/:code" element={<CollectionPage type="albums" />} />
                    <Route path="/playlists/:code" element={<CollectionPage type="playlists" />} />
                    <Route path="/songs/:code" element={<CollectionSong />} />
                    <Route path="/" element={<HomeBody />} exact />
                </Routes>
                <Footer />
            </div>
            <PlayerExtension />
        </div>
    );
}

export default Body;