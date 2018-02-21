const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const games = {}

app.get('/status/', (req, res) => res.send('Backend is up!'))

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

app.listen(4000, () => console.log('Example app listening on port 4000!'))
