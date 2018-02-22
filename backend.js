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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
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
    const ID = Math.random().toString(36).substr(2, 9)
    games[ID] = req.body
    res.status(201).send({ ID })
})

app.get('/game/:id/', (req, res) => {
    const game = games[req.params.id]
    if (!game) return res.sendStatus(404)
    res.send(game)
})

app.put('/game/:id/', (req, res) => {
    if (!games[req.params.id]) return res.sendStatus(404)
    games[req.params.id] = req.body
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
