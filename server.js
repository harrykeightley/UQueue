const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const PORT = 8081

// Needed for uq nginx setup
app.set('trust proxy', 'loopback')

// Database setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/uqueue', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("Connected to MongoDB successfully.")
})

// Queue functions
const { broadcast, change, askQuestion } = require('./helpers/queueFunctions')

// Server sockets
io.on('connect', socket => {
    socket.on('init', (qid) => {
        socket.join(qid)
        broadcast(qid, socket, false)
    })

    socket.on('update', (qid) => {
        broadcast(qid, socket, false)
    })

    // TODO: bad implementation, need to decompose into individual changes
    socket.on('change', async (qid, tutor, questionData) => {
        await change(qid, tutor, questionData)
        broadcast(qid, socket, true)
    })

    socket.on('ask', async (qid, user) => {
        askQuestion(qid, user, socket)
    })

    socket.on('cya', (qid) => {
        socket.leave(qid)
    })
})

// Next + Express integration
nextApp.prepare().then(() => {

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(PORT, (err) => {
        if (err) throw err
        console.log(`Ready on http://localhost:${PORT}`)
    })

}).catch((err) => {
    console.error(err.stack)
    process.exit(1)
})
