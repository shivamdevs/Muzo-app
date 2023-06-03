import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from './core/firebase/config';
import AppContext from './core/app/AppContext';
import Accounts from 'myoasis-accounts';
import { Route, Routes } from 'react-router-dom';
import AppWindow from './AppWindow';
import axios from 'axios';
import AppData from './core/app/AppData';

function App() {
    const [user, userLoading, userError] = useAuthState(firebase.auth);

    const [contentHome, setContentHome] = useState(null);

    const [playerList, updatePlayerList] = useState(null);
    const [playerIndex, updatePlayerIndex] = useState(-1);

    useEffect(() => {
        if (!userLoading) window.loadingOverlayRemove();
    }, [userLoading]);

    useEffect(() => {
        if (userError) console.error(userError);
    }, [userError]);

    useEffect(() => {
        axios.get(AppData.apiPath.home).then((data) => {
            setContentHome(data.data.data);
            console.log(data.data.data);
        }).catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        console.log(playerList, playerIndex);
    }, [playerIndex, playerList]);

    const context = {
        user,
        userLoading,

        playerList,
        playerIndex,

        contentHome,

        updatePlayerList,
        updatePlayerIndex,
    };
    return (
        <AppContext.Provider value={context}>
            <Routes>
                <Route path="/accounts/*" element={<Accounts />} />
                <Route path="/*" element={<AppWindow />} />
            </Routes>
        </AppContext.Provider>
    )
}

export default App;