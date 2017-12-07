import React from 'react';
import Square from './square.js';

export default class Board extends React.Component {

	renderSquare(i) {
		return (
			<Square key={i} isAvailable={this.props.availableMoves.indexOf(i) > -1} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
		);
	}

	render() {
		const rows = [];
		for (let j = 0; j < 8; j++) {
			const cols = [];
			for (let i = 0; i < 8; i++) {
				cols.push(this.renderSquare(i + (j * 8)))
			}
			rows.push(<div className="board-row" key={j}>{cols}</div>);
		}
		return (<div>{rows}</div>);
	}
}