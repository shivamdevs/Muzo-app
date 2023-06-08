import React, { useContext } from 'react';
import HomeList from './HomeList';
import "../../styles/Home.scss";
import AppContext from '../../core/app/AppContext';

function HomeBody() {
    const { contentHome } = useContext(AppContext);
    return (
        <div className="homebody">
            <HomeList title="Trending Today" data={contentHome?.trending?.songs} dataAdd={contentHome?.trending?.albums} path="/trending" />
            <HomeList title="New Releases" data={contentHome?.albums} path="/releases" />
            <HomeList title="Hit Playlists" data={contentHome?.playlists} path="/playlists" />
            <HomeList title="Top Charts" data={contentHome?.charts} path="/charts" />
        </div>
    );
}

export default HomeBody;