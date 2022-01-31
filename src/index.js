import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
require('dotenv').config()
var language = window.navigator.language
var params = new URLSearchParams(window.location.search)
//the debug param stops the loading of state from the cookie, so you can start the questions again.
ReactDOM.render(
  <React.StrictMode>
    <App language={language.substring(0,2)} debug={params.get('debug')}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
