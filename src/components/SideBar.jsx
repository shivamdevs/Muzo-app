import React, { useContext } from 'react';
import "../styles/SideBar.scss";
import AppContext from '../core/app/AppContext';
import { useNavigate } from 'react-router-dom';


function SideBar() {
    const { user, userCDbPlayLists } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <div id="sidebar">
            <div className="title">Browse</div>
            <button type="button" className='bs-link' onClick={() => navigate(`/`)}>Home</button>
            <button type="button" className='bs-link' onClick={() => navigate(`/trending`)}>Trending Today</button>
            <button type="button" className='bs-link' onClick={() => navigate(`/releases`)}>New Releases</button>
            <button type="button" className='bs-link' onClick={() => navigate(`/playlists`)}>Playlists</button>
            <button type="button" className='bs-link' onClick={() => navigate(`/charts`)}>Top Charts</button>

            {user && <>
                <div className="title">Library</div>
                <button type="button" className='bs-link' onClick={() => navigate(`/favorites`)}>Favorites</button>
                <button type="button" className='bs-link' onClick={null}>New Playlist</button>

                <div className="title">Your Playlists</div>
                {userCDbPlayLists?.map(list => <button type="button" className='bs-link' onClick={() => navigate(`/me/playlist/${list.doc.id}`)}>{list.name}</button>)}
                {!userCDbPlayLists?.length && <div className="add-play">You don't have any playlist yet.<br />Create a new one!</div>}
            </>}
        </div>
    );
}

export default SideBar;