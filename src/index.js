import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
require('dotenv').config()
let allCookies = document.cookie
var language = window.navigator.language
var languages = window.navigator.languages
console.log(allCookies, language, languages)
document.documentElement.lang = 'es-MX'
console.log(document.documentElement.lang)
ReactDOM.render(
  <React.StrictMode>
    <App language={language.substring(0,2)}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
