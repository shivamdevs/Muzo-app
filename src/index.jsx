import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './core/worker/serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { OasisMenuBlock } from 'oasismenu';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <OasisMenuBlock>
                <App />
            </OasisMenuBlock>
            <Toaster position="bottom-center" containerStyle={{ bottom: 116 }} />
        </BrowserRouter>
    </React.StrictMode>
);

serviceWorkerRegistration.register();