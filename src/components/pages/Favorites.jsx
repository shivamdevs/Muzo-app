import React, { useContext } from 'react';
import Pagination from '../common/Pagination';
import PreviewSong from '../common/PreviewSong';
import AppContext from '../../core/app/AppContext';

function Favorites() {

    const { userCDbFavorites } = useContext(AppContext);
    return (
        <Pagination title="Favorites">
            {(userCDbFavorites || (new Array(10)).fill(null))?.map((item, index) => <PreviewSong
                key={`${item?.id}${index}`}
                count={`${index + 1}`.padStart(`${userCDbFavorites?.length}`.length, '0')}
                data={item}
                favorite={true}
            />)}
        </Pagination>
    );
}

export default Favorites;