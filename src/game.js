import React from 'react';
import Board from './board.js';
import Ai from './ai.js';

export default class Game extends React.Component {

	constructor(props) {
		super(props);

		this.ai = new Ai(this);

		const initSquares = Array(64).fill(null);
		[initSquares[8 * 3 + 3], initSquares[8 * 3 + 4], initSquares[8 * 4 + 4], initSquares[8 * 4 + 3]] = ['X', 'O', 'X', 'O'];

		this.state = {
			history: [{
				squares: initSquares,
				xNumbers: 2,
				oNumbers: 2,
				xWasNext: true
			}],
			stepNumber: 0,
			xIsNext: true,
			blackisAi: true
		}
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
			.filter((item) => { return item; });
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[this.state.stepNumber];

		if (this.calculateWinner(current.xNumbers, current.oNumbers) || current.squares[i]) {
			return;
		}

		const changedSquares = this.flipSquares(current.squares, i, this.state.xIsNext);

		if (changedSquares === null) {
			return;
		}

		const xNumbers = changedSquares.reduce((acc, current) => { return current === 'X' ? acc + 1 : acc }, 0);
		const oNumbers = changedSquares.reduce((acc, current) => { return current === 'O' ? acc + 1 : acc }, 0);

		let shouldTurnColor = this.checkAvailableMoves(!this.state.xIsNext, changedSquares).length > 0 ? !this.state.xIsNext : this.state.xIsNext

		this.setState({
			history: history.concat([{
				squares: changedSquares,
				xNumbers: xNumbers,
				oNumbers: oNumbers,
				xWasNext: shouldTurnColor
			}]),
			stepNumber: history.length,
			xIsNext: shouldTurnColor,
		},
		this.doRobotMove);
	}

	doRobotMove() {
		if ((this.state.blackisAi) && (!this.state.xIsNext)) {
			var bestMove = this.ai.doMove();
			if (bestMove !== null) {
				this.handleClick(bestMove);
			}
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: parseInt(step, 0),
			xIsNext: this.state.history[step].xWasNext
		});
	}

	render() {
		const history = this.state.history.slice();
		const current = history[this.state.stepNumber];

		const winner = this.calculateWinner(current.xNumbers, current.oNumbers);

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
					<div className="game-status">{status}</div>
				</div>
				<div className="game-info">
					<div>White markers: {current.xNumbers}</div>
					<div>Black markers: {current.oNumbers}</div>
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