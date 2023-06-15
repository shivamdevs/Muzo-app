import React, { useContext } from 'react';
import Pagination from '../common/Pagination';
import AppContext from '../../core/app/AppContext';

function Favorites() {

    const { userCDbFavorites } = useContext(AppContext);
    return (
        <Pagination title="Favorites" value={userCDbFavorites} />
    );
}

export default Favorites;