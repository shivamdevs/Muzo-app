import React from 'react';
import "../styles/Header.scss";
import AppLogo from './icons/AppLogo';
import AppName from './icons/AppName';

function Header() {
    return (
        <header id="header">
            <div className="logo">
                <AppLogo size={45} />
                <AppName size={30} />
            </div>
        </header>
    )
}

export default Header;