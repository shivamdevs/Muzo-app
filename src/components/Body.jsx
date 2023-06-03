import React, { useContext } from 'react';
import AppContext from '../core/app/AppContext';
import HomeList from './home/HomeList';
import "../styles/Home.scss";

function Body() {

    const { contentHome } = useContext(AppContext);
    return (
        <div id="body">
            <HomeList title="New Albums" data={contentHome?.["albums"]} />
            <HomeList title="Playlists" data={contentHome?.["playlists"]} />
            <HomeList title="Top Charts" data={contentHome?.["charts"]} />
            {/* <HomeList title="Trending Today" value="trending" /> */}
        </div>
    );
}

export default Body;