// const App = require('./js/components/App');
// require.context("./assets/", true,/\.(png|jpe?g|gif|svg)$/i)
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import App from './js/components/App';

console.log('putting app in container');

ReactDOM.render(<App />, document.getElementById('container'));

