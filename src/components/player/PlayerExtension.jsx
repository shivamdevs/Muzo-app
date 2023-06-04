import React, { useContext } from 'react';
import AppContext from '../../core/app/AppContext';
import convertHTMLEntities from '../../core/app/convertHTMLEntities';
import PlayerQueue from './PlayerQueue';

function PlayerExtension() {

    const { playerSong, playerList, playerIndex, playerElement, updatePlayerList, updatePlayerIndex, setPlayerExtended } = useContext(AppContext);

    return (
        <div className="player-extension">
            {playerSong && <>
                <div className="iconic">
                    <img src={playerSong.image.find(item => item.quality === "500x500").link} alt={convertHTMLEntities(playerSong.name)} />
                    <div className="name">{convertHTMLEntities(playerSong.name)}</div>
                    <div className="artist">{convertHTMLEntities(playerSong.primaryArtists)}</div>
                </div>
                <div className="queuer">
                    <div className="queue-box">
                        <PlayerQueue playerList={playerList} playerIndex={playerIndex} playerElement={playerElement} updatePlayerList={updatePlayerList} updatePlayerIndex={updatePlayerIndex} setPlayerExtended={setPlayerExtended} />
                    </div>
                </div>
            </>}
        </div>
    );
}

export default PlayerExtension;