import React from 'react';
import HomeListItem from './HomeListItem';

function HomeList({ title, data }) {

    const entryList = data?.filter((d, i) => i < 10) || (new Array(10)).fill(null);
    return (
        <div className="home-list">
            <div className="header">
                <div className="title">{title}</div>
                <div className="show-all">
                    <button type="button">Show All</button>
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