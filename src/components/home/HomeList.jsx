import React from 'react';
import HomeListItem from './HomeListItem';
import { useNavigate } from 'react-router-dom';

function HomeList({ title, data, path }) {

    const entryList = data?.filter((d, i) => i < 10) || (new Array(10)).fill(null);
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
                    {Array.isArray(entryList) && entryList.map((item, index) => <HomeListItem key={item?.id || index} data={item} />)}
                </div>
            </div>
        </div>
    );
}

export default HomeList;