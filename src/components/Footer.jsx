import React from 'react';
import "../styles/Footer.scss";
import AppLogo from './icons/AppLogo';
import AppName from './icons/AppName';
import { Link } from 'react-router-dom';
import AppData from '../core/app/AppData';

function Footer() {
    return (
        <footer id="footer">
            <div className="logo">
                <AppLogo size={60} />
                <AppName size={40} />
            </div>
            <div className="flexbox">
                <div className="navbar">
                    <nav className="nav">
                        <Link to='/'>Home</Link>
                        <Link to='/trending'>Trending</Link>
                        <Link to='/releases'>New Releases</Link>
                        <Link to='/playlists'>Playlists</Link>
                        <Link to='/charts'>Top Charts</Link>
                    </nav>
                    <nav className="nav">
                        <Link to='#'>Help and Support</Link>
                        <Link to='#'>Privacy Policy</Link>
                        <Link to='#'>Terms of Use</Link>
                        <Link to='#'>Data Usage</Link>
                    </nav>
                    <nav className="nav">
                        <div className="contact">A group of degenerates...</div>
                        <div className="address">Somewhere in India, Asia</div>
                        <div className="address">+91 X0X0X - 0X0X0</div>
                        <div className="address">contact@muzo.com</div>
                    </nav>
                </div>
                <div className="api">Made possible with <a href="http://saavn.me" target="_blank" rel="noopener noreferrer">Saavn.me</a></div>
                <div className="copyright">{AppData.parent.copyright}</div>
            </div>
        </footer>
    );
}

export default Footer;