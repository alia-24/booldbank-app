// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';
//import App from './App-user';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);