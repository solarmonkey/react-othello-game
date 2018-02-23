export function flipSquares(squares, position, xIsNext) {
    let modifiedBoard = null;
    // Calculate row and col of the starting position
    let [startX, startY] = [position % 8, (position - position % 8) / 8];

    if (squares[position] !== null) {
        return null;
    }

    // Iterate all directions, these numbers are the offsets in the array to reach next sqaure
    calculateOffsets(8).forEach((offset) => {
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
}

export function calculateOffsets(index) {
    return [1, -1].concat(index - 1).concat(index).concat(index + 1).concat(-index - 1).concat(-index).concat(-index + 1)
}
