import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../core/app/AppContext';
import "../../styles/Search.scss";
import axios from 'axios';
import AppData from '../../core/app/AppData';
import convertToFormDataString from '../../core/app/convertToFormDataString';
import LoadSVG from 'react-loadsvg';
import ShowAllSongs from '../collection/ShowAllSongs';

function Search() {
    const { playerQuerySearch, playerExtended, setPlayerExtended } = useContext(AppContext);

    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (playerExtended) setPlayerExtended(false);
    }, [playerExtended, setPlayerExtended]);

    useEffect(() => {
        if (!playerQuerySearch) return setSearchResults(null);
        setSearchLoading(true);
        axios.get(AppData.apiPath.search + convertToFormDataString(playerQuerySearch)).then((result) => {
            const data = result.data.data;
            const mapped = [];
            Object.keys(data).forEach(item => {
                const value = data[item];
                const results = value.results.filter(it => it.type !== 'artist');
                mapped[value.position] = [item, results];
            });
            setSearchResults(mapped);
        }).catch(error => console.error(error)).finally(() => {
            setSearchLoading(false);
        });
    }, [playerQuerySearch]);
    return (
        <div id="search">
            {playerQuerySearch && <>
                <div className="title">Search {searchLoading && <LoadSVG size="1em" stroke={14} />}</div>
                <div className="query">You searched for: {playerQuerySearch}</div>
                {searchResults?.map(item =>  item[1]?.length > 0 && <ShowAllSongs key={item[0]} title={item[0]} data={item[1]} />)}
            </>}
            {!playerQuerySearch && <div className="title">Search for something...</div>}
        </div>
    );
}

export default Search;