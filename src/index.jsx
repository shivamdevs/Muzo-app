import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { OasisMenuBlock } from 'oasismenu';
import { Toaster } from 'react-hot-toast';
import { tippy } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

tippy.setDefaultProps({
    arrow: false,
    animation: "shift-away",
    delay: [200, 0],
    theme: 'tippy-theme',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <OasisMenuBlock>
                <App />
            </OasisMenuBlock>
            <Toaster position="bottom-center" containerStyle={{ top: 76, bottom: 116 }} />
        </BrowserRouter>
    </React.StrictMode>
);

serviceWorkerRegistration.register();