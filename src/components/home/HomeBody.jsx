import React, { useContext } from 'react';
import HomeList from './HomeList';
import "../../styles/Home.scss";
import AppContext from '../../core/app/AppContext';

function HomeBody() {
    const { contentHome } = useContext(AppContext);
    return (
        <div className="homebody">
            {/* <HomeList title="Trending Today" data={[...(contentHome?.trending?.songs || []), ...(contentHome?.trending?.albums || [])]} /> */}
            <HomeList title="New Albums" data={contentHome?.albums} path="/albums" />
            <HomeList title="Playlists" data={contentHome?.playlists} path="/playlists" />
            <HomeList title="Top Charts" data={contentHome?.charts} path="/charts" />
        </div>
    );
}

export default HomeBody;