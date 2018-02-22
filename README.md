## Othello game written in JavaScript using React.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and is a good starting point to get the basic understanding of the React framework.

* Install external packages: `npm install`
* Start the developing server: `npm start`
* Start the backend server: `npx nodemon -w backend.js backend.js`

The mechanics of the game Othello is described [here](https://en.wikipedia.org/wiki/Reversi).

The game has been implemented in the front-end using two components (three, if you count the main Game component).
The Board is implemented by a React Component, where each square is implemented by a functional component.

`game.js` contains all of the game logic, except one function which was readily extracted to `utils.js`. 
There is one test in `utils.test.js`, which has not been written. Testing is implemented using Jest testing framework by Facebook.

* Front-end tests can be run with the command: `npm test`

#### Playing a game
Make sure you have started the deveopment and backend servers

When visiting http://localhost:3000/ you should automatically start a new game, for which the unique id is appended to the URL

You can now make a move (multiple moves in fact, as you can also play for black). 
When refreshing the page it reloads the game that you were playing as the state of the game is persisted to the backend.
