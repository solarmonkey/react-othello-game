import { calculateOffsets, flipSquares } from './utils.js'

describe('8x8 board', () => {
    test('should return array with X\'s for valid move', () => {
        const squares = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, 'X',  'O',  null, null, null,
            null, null, null, 'O',  'X',  null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        const position = 34
        const xIsNext = true
        const expectedResult = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, 'X',  'O',  null, null, null,
            null, null, 'X',  'X',  'X',  null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return array with O\'s for valid move', () => {
        const squares = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null,  'X',  'O', null, null, null,
            null, null,  'X',  'X',  'X', null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        const position = 42
        const xIsNext = false
        const expectedResult = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null,  'X',  'O', null, null, null,
            null, null,  'X',  'O',  'X', null, null, null,
            null, null,  'O', null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return null for invalid move for X', () => {
        const squares = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null,  'X',  'O', null, null, null,
            null, null, null,  'O',  'X', null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        const position = 18
        const xIsNext = true
        const expectedResult = null
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return null for invalid move for O', () => {
        const squares = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null,  'X',  'O', null, null, null,
            null, null,  'X',  'X',  'X', null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
        ]
        const position = 18
        const xIsNext = false
        const expectedResult = null
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
})    

describe('6x6 board', () => {
    test('should return array with X\'s for valid move', () => {
        const squares = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null, 'X',   'O', null, null,
            null, null, 'O',   'X', null, null,
            null, null, null, null, null, null,
            null, null, null, null, null, null,
        ]
        const position = 26
        const xIsNext = true
        const expectedResult = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null, 'X',   'O', null, null,
            null, null, 'X',   'X', null, null,
            null, null, 'X',  null, null, null,
            null, null, null, null, null, null,
        ]
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return array with O\'s for valid move', () => {
        const squares = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null,  'X',  'O', null, null,
            null, null,  'X',  'X', null, null,
            null, null,  'X', null, null, null,
            null, null, null, null, null, null,
        ]
        const position = 27
        const xIsNext = false
        const expectedResult = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null,  'X',  'O', null, null,
            null, null,  'X',  'O', null, null,
            null, null,  'X',  'O', null, null,
            null, null, null, null, null, null,
        ]
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return null for invalid move for X', () => {
        const squares = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null,  'X',  'O', null, null,
            null, null,  'O',  'X', null, null,
            null, null, null, null, null, null,
            null, null, null, null, null, null,
        ]
        const position = 7
        const xIsNext = true
        const expectedResult = null
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
    
    test('should return null for invalid move for O', () => {
        const squares = [
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            null, null,  'X',  'O', null, null,
            null,  'X',  'X',  'X', null, null,
            null, null, null, null, null, null,
            null, null, null, null, null, null,
        ]
        const position = 7
        const xIsNext = false
        const expectedResult = null
        expect(flipSquares(squares, position, xIsNext)).toEqual(expectedResult)
    })
})    

describe('Create offsets', () => {
    test('should return offsets for index 8 [1, 7, 8, 9, -1, -7, -8, -9]', () => {
        const index = 8
        const expectedResult = [1, 7, 8, 9, -1, -7, -8, -9]
        expect(calculateOffsets(index).sort()).toEqual(expectedResult.sort())
    })
    test('should return offsets for index 6 [1, 5, 6, 7, -1, -5, -6, -7]', () => {
        const index = 6
        const expectedResult = [1, 5, 6, 7, -1, -5, -6, -7]
        expect(calculateOffsets(index).sort()).toEqual(expectedResult.sort())
    })
})
