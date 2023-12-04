import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from "../src/redux/configureStore";
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRouter from './AppRouter';

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppRouter />
    </PersistGate> 
  </Provider>
);