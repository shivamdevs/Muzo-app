import React from 'react';
import "../../styles/Pagination.scss";

function Pagination({ title, children }) {
    return (
        <div className="pagination">
            <div className="titled">{title}</div>
            <div className="listbox">{children}</div>
        </div>
    );
}

export default Pagination;