import React from 'react'

export default function AppLogo({ size = 512 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={size} height={size} x="0" y="0" className="app-logo" viewBox="0 0 64 64" style={{ enableBackground: "new 0 0 512 512" }}>
            <g>
                <linearGradient id="a" x1="9.5" x2="48" y1="2" y2="52" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fa1228"></stop>
                    <stop offset=".901" stopColor="#5a00d1"></stop>
                </linearGradient>
                <g fill="url(#a)" fillRule="evenodd" clipRule="evenodd">
                    <path d="M34.894 18.211A2 2 0 0 0 32 20v13.674A7 7 0 1 0 36 40V23.236l3.106 1.553a2 2 0 0 0 1.788-3.578zM29 37a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                    <path d="M32 2C15.431 2 2 15.431 2 32s13.431 30 30 30 30-13.431 30-30S48.569 2 32 2zM6 32C6 17.64 17.64 6 32 6s26 11.64 26 26-11.64 26-26 26S6 46.36 6 32z"></path>
                </g>
            </g>
        </svg>
    )
}
