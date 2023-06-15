import React, { useContext } from 'react';
import Pagination from '../common/Pagination';
import AppContext from '../../core/app/AppContext';
import { MdOutlineFavoriteBorder } from 'react-icons/md';

function Favorites() {

    const { user, userCDbFavorites } = useContext(AppContext);
    console.log(userCDbFavorites);
    return (
        <Pagination title={userCDbFavorites?.length ? null : "Favorites"} cover={userCDbFavorites?.[0] && {
            image: userCDbFavorites?.[0].image[2].link,
            name: "Favorites",
            artist: user.displayName,
            songs: userCDbFavorites?.length,
            play: (userCDbFavorites || []).map(song => parseInt(song.duration)).reduce((time, sum) => (time + sum), 0),
        }} value={userCDbFavorites} removeFav>
            {!userCDbFavorites?.length && <div style={{ color: "#727888" }}>You don't have any favorite songs yet. Add one by clicking on <MdOutlineFavoriteBorder /> icon.</div>}
        </Pagination>
    );
}

export default Favorites;