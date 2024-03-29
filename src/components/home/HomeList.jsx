import React from 'react';
import { useNavigate } from 'react-router-dom';
import removeDuplicateObjectsById from '../../core/app/removeDuplicateObjectsById';
import PreviewCollection from '../common/PreviewCollection';

function HomeList({ title, data, dataAdd, path }) {

    let entryList = data || (new Array(10)).fill(null);
    if (dataAdd) entryList = [...entryList, ...dataAdd];
    entryList = entryList.filter((d, i) => i < 10);
    const navigate = useNavigate();
    return (
        <div className="home-list">
            <div className="header">
                <div className="title">{title}</div>
                <div className="show-all">
                    <button type="button" onClick={() => path && navigate(path)}>Show All</button>
                </div>
            </div>
            <div className="list">
                <div className="flow">
                    {Array.isArray(entryList) && removeDuplicateObjectsById(entryList).map((item, index) => <PreviewCollection key={`${item?.id}${index}`} data={item} />)}
                </div>
            </div>
        </div>
    );
}

export default HomeList;