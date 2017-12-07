import React from 'react';

export default function Square(props) {
	let squareClasses = `square ${props.isAvailable ? 'available-square' : 'not-available-square'}`;
	let colorMarkerClasses = props.value === 'X' ? 'marker white' : props.value === 'O' ? 'marker black' : '';

	return (
		<div className={squareClasses} onClick={props.onClick}>
			{props.value ? <div className={colorMarkerClasses}></div> : ''}
		</div>
	);
}