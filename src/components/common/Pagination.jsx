import React, { useContext } from 'react';
import "../../styles/Pagination.scss";
import AppContext from '../../core/app/AppContext';
import PreviewSong from './PreviewSong';
import SongCover from './SongCover';

function Pagination({ title, cover, value, children }) {
    const { userCDbFavorites } = useContext(AppContext);
    return (
        <div className="pagination">
            {title && <div className="titled">{title}</div>}
            {cover && <SongCover cover={cover} songs={value} />}
            <section>{value !== undefined && (value || (new Array(10)).fill(null))?.map((item, index) => <PreviewSong
                key={`${item?.id}${index}`}
                count={`${index + 1}`.padStart(`${value?.length}`.length, '0')}
                data={item}
                favorite={(userCDbFavorites || []).find(song => song?.id === item?.id)}
            />)}{children}</section>
        </div>
    );
}

export default Pagination;