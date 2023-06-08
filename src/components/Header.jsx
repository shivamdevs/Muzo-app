import React, { useContext } from 'react';
import "../styles/Header.scss";
import AppLogo from './icons/AppLogo';
import AppName from './icons/AppName';
import { Link } from 'react-router-dom';
import AppContext from '../core/app/AppContext';
import Tippy from '@tippyjs/react';
import { OasisMenu, OasisMenuBreak, OasisMenuItem, OasisMenuTrigger } from 'oasismenu';
import { MdAccountCircle, MdLogout, MdVerifiedUser } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineExternalLink } from 'react-icons/hi';
import firebase from '../core/firebase/config';
import { RiArrowDropDownLine } from 'react-icons/ri';


const availableLanguages = [
    "Assamese",
    "Bengali",
    "Bhojpuri",
    "Gujarati",
    "Haryanvi",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Odia",
    "Punjabi",
    "Rajasthani",
    "Tamil",
    "Telugu",
    "Urdu"
];

function Header() {
    const { user, userLoading, settings, updateSettings, playerQuerySearch, setPlayerQuerySearch } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const updateLanguage = (lang) => {
        lang = lang.toLowerCase();
        updateSettings("languages", (old) => {
            const langs = [...(old || [])];
            if (langs.includes(lang)) langs.splice(langs.indexOf(lang), 1); else langs.push(lang);
            langs.sort();
            return langs;
        });
    };
    return (
        <header id="header">
            <div to='/' className="logo" onClick={() => navigate('/')}>
                <AppLogo size={45} />
                <AppName size={30} />
            </div>
            <div className="search">
                <div className="box">
                    <input
                        type="search"
                        onFocus={() => location.pathname !== '/search' && navigate('/search')}
                        onBlur={() => {
                            !playerQuerySearch && navigate(-1);
                        }}
                        value={playerQuerySearch}
                        onChange={({ target }) => {
                            location.pathname !== '/search' && navigate('/search')
                            target.value !== " " && setPlayerQuerySearch(target.value);
                        }}
                        placeholder="Search for Songs, Playlists or Albums and more..."
                    />
                </div>
            </div>
            <OasisMenuTrigger name="languages" trigger="click" toggle placement="bottom">
                <button type="button" className="lang">Song Languages <RiArrowDropDownLine /></button>
            </OasisMenuTrigger>
            <OasisMenu name="languages" theme="space">
                <OasisMenuItem disabled content="Hindi" checked />
                <OasisMenuItem disabled content="English" checked />
                <OasisMenuBreak />
                {availableLanguages.map(lang => <OasisMenuItem key={lang} preventClose content={lang} checked={settings.languages?.includes(lang.toLowerCase())} onClick={() => updateLanguage(lang)} />)}
            </OasisMenu>
            {!userLoading && <>
                {user && <>
                    <OasisMenuTrigger name="user-options" trigger="click" toggle placement="bottom-right">
                        <Tippy content={user.displayName} placement="right">
                            <button type='button' className="user"><img src={user.photoURL} alt={user.displayName} /></button>
                        </Tippy>
                    </OasisMenuTrigger>
                    <OasisMenu name="user-options" theme="space">
                        <OasisMenuItem icon={<MdAccountCircle />} onClick={() => navigate('/accounts/profile')} content="Edit profile" statusIcon={<HiOutlineExternalLink />} />
                        <OasisMenuItem icon={<MdVerifiedUser />} onClick={() => navigate('/profile')} content="Profile" />
                        <OasisMenuBreak />
                        <OasisMenuItem icon={<MdLogout />} onClick={firebase.logout} content="Logout" />
                    </OasisMenu>
                </>}
                {!user && <Link to='/accounts' className='add-user'>Login</Link>}
            </>}
        </header>
    )
}

export default Header;