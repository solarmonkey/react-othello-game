import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Game from './game.js';

const socket = new WebSocket('ws://localhost:4000/');

ReactDOM.render(<Game />, document.getElementById('root'));

socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
window.socket = socket