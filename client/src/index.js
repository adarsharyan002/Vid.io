import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import { SocketProvider } from './context/SocketProvide';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Provider store={configureStore}>
        <GoogleOAuthProvider clientId="531623555053-lkdpa5qic3tvb1ehlgto42l7vr3c0k0u.apps.googleusercontent.com">

          <App />
  </GoogleOAuthProvider>

        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
