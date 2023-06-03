import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './core/worker/serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { OasisMenuBlock } from 'oasismenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <OasisMenuBlock>
                <App />
            </OasisMenuBlock>
        </BrowserRouter>
    </React.StrictMode>
);

serviceWorkerRegistration.register();