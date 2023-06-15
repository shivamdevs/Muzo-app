import React, { useContext, useEffect, useRef } from 'react';
import "../styles/SideBar.scss";
import AppContext from '../core/app/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';


function SideBar() {
    const { user, userCDbPlayLists } = useContext(AppContext);

    return (
        <div id="sidebar">
            <div className="title">Browse</div>
            <NavBtn to="/" name="Home" />
            <NavBtn to="/trending" name="Trending Today" />
            <NavBtn to="/releases" name="New Releases" />
            <NavBtn to="/playlists" name="Playlists" />
            <NavBtn to="/charts" name="Top Charts" />

            {user && <>
                <div className="title">Library</div>
                <NavBtn to="/favorites" name="Favorites" />
                <NavBtn to="/me/playlists/new" name="New Playlist" />

                <div className="title">Your Playlists</div>
                {userCDbPlayLists?.map((list, index) => <NavBtn key={`${list?.id}${index}`} to={`/me/playlists/${list.id}`} name={list.name} />)}
                {!userCDbPlayLists?.length && <div className="add-play">You don't have any playlist yet.<br />Create a new one!</div>}
            </>}
        </div>
    );
}

export default SideBar;


function NavBtn({ name, to }) {
    const navigate = useNavigate();
    const location = useLocation();
    const btnRef = useRef();
    
    useEffect(() => {
        if (location.pathname === to) {
            btnRef.current.classList.add('active');
        } else {
            btnRef.current.classList.remove('active');
        }
    }, [location.pathname, to]);
    return (
        <button type="button" ref={btnRef} className='bs-link' onClick={() => navigate(to)}>{name}</button>
    );
}