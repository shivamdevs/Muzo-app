import React from 'react';
import "../../styles/Home.scss";
import removeDuplicateObjectsById from '../../core/app/removeDuplicateObjectsById';
import PreviewCollection from '../common/PreviewCollection';

function ShowAllSongs({ title, data, dataAdd, prefix = "" }) {

    let entryList = data || (new Array(10)).fill(null);
    if (dataAdd) entryList = [...entryList, ...dataAdd];
    entryList = entryList.filter((d, i) => i < 10);
    return (
        <div className="homebody">
            <div className="home-list as-grid">
                <div className="header">
                    <div className="title">{prefix} {title}</div>
                </div>
                <div className="grid">
                    {Array.isArray(entryList) && removeDuplicateObjectsById(entryList).map((item, index) => <PreviewCollection key={`${item?.id}${index}`} data={item} />)}
                </div>
            </div>
        </div>
    );
}

export default ShowAllSongs;