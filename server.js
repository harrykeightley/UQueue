const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const PORT = 3000

function getQueueData(id) {
    return [
        { name: `Wike ${id}`, questionsAsked: 3, time: '8' },
        { name: 'Dick Van Dyjke', questionsAsked: 3, time: '8' }
    ]
}

io.on('connect', socket => {
    socket.emit('now', {
        msg: 'Allo boyo'
    })

    socket.on('init', (id) => {
        socket.join(id)
        socket.emit('init', getQueueData(id))
    })

    // TODO: Awful implementation, need to decompose into individual changes
    socket.on('change', (id, questions) => {
        socket.to(id).emit('change', questions)
    })
})


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