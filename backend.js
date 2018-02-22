const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const WebSocket = require('ws')
const http = require('http')
const url = require('url')

// Middleware
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE")
    next()
})
app.use(function(req, res, next) {
    next()
    console.info(`${req.method} ${req.path} ${res.statusCode}`)
})


// State
const games = {}

// Routes

app.get('/', (req, res) => res.send('Backend is up!'))

app.post('/new-game/', (req, res) => {
    const id = Math.random().toString(36).substr(2, 9)
    games[id] = {
        id: id,
        squares: flatten(newBoard()),
        xWasNext: true
    }
    res.status(201).send(games[id])
})

app.get('/game/:id/', (req, res) => {
    const game = games[req.params.id]
    if (!game) return res.sendStatus(404)
    res.send(game)
})

app.put('/game/:id/', (req, res) => {
    if (!games[req.params.id]) return res.sendStatus(404)
    console.log(req.body)
    games[req.params.id].squares = req.body.squares
    games[req.params.id].xWasNext = req.body.xWasNext
    res.sendStatus(200)
})

// Websockets

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.send('Hello from server!')
  ws.on('error', (err) => console.error(err))
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  })

})
wss.on('error', (err) => console.error(err))


server.listen(4000, function listening() {
  console.log('Listening on %d', server.address().port)
})
// app.listen(4000, () => console.log('Example app listening on port 4000!'))


// Helpers

function newBoard() {
    const initSquares = Array(8).fill(null).map(() => Array(8).fill(null))
    initSquares[3][3] = 'X'
    initSquares[3][4] = 'O'
    initSquares[4][4] = 'X'
    initSquares[4][3] = 'O'
    return initSquares
}

function flatten(board) {
    return board.reduce((results, row) => {
        return results.concat(row)
    }, [])
}

function flipSquares(board, position, xIsNext) {
    let modifiedBoard = null;
    // Calculate row and col of the starting position
    let [startX, startY] = [position % 8, (position - position % 8) / 8];

    if (board[position] !== null) {
        return null;
    }

    // Iterate all directions, these numbers are the offsets in the array to reach next sqaure
    [1, 7, 8, 9, -1, -7, -8, -9].forEach((offset) => {
        let flippedSquares = modifiedBoard ? modifiedBoard.slice() : board.slice();
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
                modifiedBoard = flippedboard.slice();
            }
            break;
        }
    });

    return modifiedBoard;
}
