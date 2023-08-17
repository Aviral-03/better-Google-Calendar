import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
// import App from './App';
import AppRouter from './AppRouter';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from "../src/redux/configureStore";
import 'bootstrap/dist/css/bootstrap.min.css';

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
        </PersistGate>
    </Provider>
);
