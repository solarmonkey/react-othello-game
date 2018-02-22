import React from 'react';
import Board from './board.js';
import Ai from './ai.js';

// X is white, O is black
const serverUrl = 'http://localhost:4000/'

export default class Game extends React.Component {

	constructor(props) {
		super(props);
		this.ai = new Ai(this);
		this.isX = null
		this.socket = null
		
		const initSquares = Array(64).fill(null);

		this.state = {
			history: [{
				squares: initSquares,
				xWasNext: true
			}],
			stepNumber: 0,
			xIsNext: true,
			blackisAi: false
		}

		if (document.location.hash) {
			const url = serverUrl + 'game/' + document.location.hash.substring(1) + '/'
			fetch(url).then(response => response.json()).then((data) => {
				console.log(data)
				this.gameId = data.id
				this.initGame(data.board)
				this.socket = this.openWebSocket()
			})
		} else {
			const url = serverUrl + 'new-game/'
			fetch(url, { method: 'POST' }).then(response => response.json()).then((data) => {
				console.log(data)
				this.initGame(data.board)
				this.gameId = data.id
				document.location.hash = data.id
				this.socket = this.openWebSocket()
			})
		}
	}

	openWebSocket() {
		const socket = new WebSocket('ws://localhost:4000/')

		socket.onopen = (e) => {
			console.log('Connected to ' + e.currentTarget.url)
		}

		socket.onerror = (err) => {
			console.warn('Websocket error: ' + err)
		}

		socket.onmessage = (e) => {
			const message = e.data
			console.info('Message received: ', message)
		}

		socket.onclose = (e) => {
			console.log('Connection closed')
		}

		return socket
	}
	
	initGame(initSquares) {
		this.setState({
			history: [{
				squares: initSquares,
				xWasNext: true
			}],
			stepNumber: 0,
			xIsNext: true,
			blackisAi: false
		})
	}

	calculateWinner(xNumbers, oNumbers) {
		return (xNumbers + oNumbers < 64) ? null : (xNumbers === oNumbers) ? 'XO' : (xNumbers > oNumbers ? 'X' : 'O');
	}

	flipSquares(squares, position, xIsNext) {
		let modifiedBoard = null;
		// Calculate row and col of the starting position
		let [startX, startY] = [position % 8, (position - position % 8) / 8];

		if (squares[position] !== null) {
			return null;
		}

		// Iterate all directions, these numbers are the offsets in the array to reach next sqaure
		[1, 7, 8, 9, -1, -7, -8, -9].forEach((offset) => {
			let flippedSquares = modifiedBoard ? modifiedBoard.slice() : squares.slice();
			let atLeastOneMarkIsFlipped = false;
			let [lastXpos, lastYPos] = [startX, startY];

			for (let y = position + offset; y < 64; y = y + offset) {

				// Calculate the row and col of the current square
				let [xPos, yPos] = [y % 8, (y - y % 8) / 8];

				// Fix when board is breaking into a new row or col
				if (Math.abs(lastXpos - xPos) > 1 || Math.abs(lastYPos - yPos) > 1) {
					break;
				}

				// Next square was occupied with the opposite color
				if (flippedSquares[y] === (!xIsNext ? 'X' : 'O')) {
					flippedSquares[y] = xIsNext ? 'X' : 'O';
					atLeastOneMarkIsFlipped = true;
					[lastXpos, lastYPos] = [xPos, yPos];
					continue;
				}
				// Next aquare was occupied with the same color
				else if ((flippedSquares[y] === (xIsNext ? 'X' : 'O')) && atLeastOneMarkIsFlipped) {
					flippedSquares[position] = xIsNext ? 'X' : 'O';
					modifiedBoard = flippedSquares.slice();
				}
				break;
			}
		});

		return modifiedBoard;
	}

	checkAvailableMoves(color, squares) {
		return squares
			.map((value, index) => { return this.flipSquares(squares, index, color) ? index : null; })
			.filter((item) => { return item !== null; });
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[this.state.stepNumber];

		const xNumbers = current.squares.reduce((result, value) => { return value === 'X' ? result + 1 : result }, 0);
		const oNumbers = current.squares.reduce((result, value) => { return value === 'O' ? result + 1 : result }, 0);

		if (this.calculateWinner(xNumbers, oNumbers) || current.squares[i]) {
			return;
		}

		const changedSquares = this.flipSquares(current.squares, i, this.state.xIsNext);

		if (changedSquares === null) {
			return;
		}

		let shouldTurnColor = this.checkAvailableMoves(!this.state.xIsNext, changedSquares).length > 0 ? !this.state.xIsNext : this.state.xIsNext

		const doMove = this.state.blackisAi
			? this.doRobotMove 
			: this.socket.readyState === WebSocket.OPEN 
				? this.prepareSendMove(i)
				: () => {}

		this.setState({
			history: history.concat([{
				squares: changedSquares,
				xWasNext: shouldTurnColor
			}]),
			stepNumber: history.length,
			xIsNext: shouldTurnColor,
		},
		doMove);
	}

	doRobotMove() {
		if ((this.state.blackisAi) && (!this.state.xIsNext)) {
			var bestMove = this.ai.doMove();
			if (bestMove !== null) {
				this.handleClick(bestMove);
			}
		}
	}

	prepareSendMove(i) {
		return () => {
			const url = serverUrl + 'game/' + this.gameId + '/'
			fetch(url, { method: 'PUT', body: this.state.history[this.state.history.length - 1] })
				.then(response => response.json()).then(data => console.log(data))
			// this.socket.send({
			// 	position: i
			// })
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: parseInt(step, 0),
			xIsNext: this.state.history[step].xWasNext
		});
	}

	resetGame() {
		this.jumpTo(0);
		this.setState({
			history: this.state.history.slice(0, 1)
		})
	}

	render() {
		const history = this.state.history.slice();
		const current = history[this.state.stepNumber];

		const xNumbers = current.squares.reduce((result, value) => { return value === 'X' ? result + 1 : result }, 0);
		const oNumbers = current.squares.reduce((result, value) => { return value === 'O' ? result + 1 : result }, 0);

		let winner = this.calculateWinner(xNumbers, oNumbers);

		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			return (
				<option key={move} value={move}>
					{desc}
				</option>
			);
		});

		const selectMoves = () => {
			return (
				<select id="dropdown" ref={(input) => this.selectedMove = input} onChange={() => this.jumpTo(this.selectedMove.value)} value={this.state.stepNumber}>
					{moves}
				</select>
			)
		}

		let availableMoves = this.checkAvailableMoves(current.xWasNext, current.squares);
		let availableMovesOpposite = this.checkAvailableMoves(!current.xWasNext, current.squares);

		if ((availableMoves.length === 0) && (availableMovesOpposite.length === 0))
		{
			winner = xNumbers === oNumbers ? 'XO' : xNumbers > oNumbers ? 'X' : 'O';
		}

		let status =
			winner ?
				(winner === 'XO') ? 'It\'s a draw' : 'The winner is ' + (winner === 'X' ? 'white' : 'black') :
				[this.state.xIsNext ? 'Whites turn' : 'Blacks turn', ' with ', availableMoves.length, ' available moves.'].join('');

		return (
			<div className="game">
				<div className="game-left-side">
					<div className="game-board">
						<Board squares={current.squares} availableMoves={availableMoves} onClick={(i) => this.handleClick(i)} />
					</div>
					<div className="game-status">{status}&nbsp;{winner ? <button onClick={() => this.resetGame()}>Play again</button> : ''}</div>
					<div></div>
				</div>
				<div className="game-info">
					<div>White markers: {xNumbers}</div>
					<div>Black markers: {oNumbers}</div>
					<br />
					<div>Select a previous move:</div>
					<div>{selectMoves()}</div>
					<br />
					<div>
						<input type="checkbox" checked={this.state.blackisAi} onChange={(e) => this.setState({ blackisAi: !this.state.blackisAi })}></input>
						Make black player to a robot
					</div>
				</div>
			</div>
		);
	}
}
