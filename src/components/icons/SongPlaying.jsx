import React from 'react';

export default function SongPlaying() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="song-playing" style={{ background: "#0000" }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="rotate(180 50 50)">
                <rect x="15" y="15" width="10" height="40" fill="#1e90ff">
                    <animate attributeName="height" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.4s"></animate>
                </rect>
                <rect x="35" y="15" width="10" height="40" fill="#ffffff99">
                    <animate attributeName="height" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.2s"></animate>
                </rect>
                <rect x="55" y="15" width="10" height="40" fill="#1e90ff">
                    <animate attributeName="height" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.6s"></animate>
                </rect>
                <rect x="75" y="15" width="10" height="40" fill="#ffffff99">
                    <animate attributeName="height" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-1s"></animate>
                </rect>
            </g>
        </svg>
    );
}
