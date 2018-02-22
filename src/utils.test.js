import { flipSquares } from './utils.js'

test('should return the new board with flipped squares', () => {
    expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
})
