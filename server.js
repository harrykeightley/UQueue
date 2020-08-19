const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const PORT = 3000

let queues = {

}

function getQueueData(qid) {
    if (queues[qid] === undefined) {
        queues[qid] = [
            { id: 0, name: `Wike ${qid}`, questionsAsked: 3, time: '8' },
            { id: 1, name: 'Dick Van Dyjke', questionsAsked: 3, time: '8' }
        ]
    }
    return queues[qid]
}

function changeQueueData(qid, tutor, questionData) {
    const { type, question } = questionData
    const id = question.id

    switch (type) {
        case 'REMOVE':
        case 'TICK':
            queues[qid] = queues[qid].filter((question) => question.id !== id)
            break
        case 'CLAIM':
            question = queues[qid].filter((question) => question.id === id)[0]
            question.claimed = true // TODO add tutor details and toggle
    }
}

// placeholder
function askQuestion(qid, user) {
    queues[qid].push({ id: queues[qid].length, name: user, questionsAsked: 0, time: '2' })
}



// Server sockets
io.on('connect', socket => {

    socket.on('init', (id) => {
        socket.join(id)
        socket.emit('init', getQueueData(id))
    })

    // TODO: Awful implementation, need to decompose into individual changes/
    socket.on('change', (qid, tutor, questionData) => {
        changeQueueData(qid, tutor, questionData)
        socket.to(qid).emit('change', queues[qid])
    })

    socket.on('ask', (qid, user) => {
        askQuestion(qid, user)
        socket.to(qid).emit('change', queues[qid])
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