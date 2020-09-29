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

const Question = require('./models/question')
const Queue = require('./models/queue')

function broadcastQueueData(qid, socket, toAll) {
    Question.find({ queue: qid }, (err, questions) => {
        if (err) {
            return console.log("Problem getting guestions from ", qid)
        }
        var recipients = toAll ? socket.to(qid) : socket
        recipients.emit('change', questions)
    })
}

async function changeQueueData(qid, tutor, questionData) {
    const { type, question } = questionData
    const id = question._id

    switch (type) {
        case 'TICK':
        //Queue.findByIdAndUpdate(qid, { `asked.${question.user.email}` : question.questionsAsked + 1 })
        case 'REMOVE':
            Question.findByIdAndDelete(id, () => { })
            break
        case 'CLAIM':
            claimedQuestion = queues[qid].filter((question) => question.id === id)[0]
            claimedQuestion.claimed = true // TODO add tutor details and toggle
    }
}


async function askQuestion(qid, user) {
    // Check if they're already in the queue
    let exists = false
    Question.findOne({ queue: qid, 'user.email': user.email }, (err, question) => {
        if (err) console.log(err)
        if (question != null) {
            exists = true;
        }
    })
    if (exists) {
        return
    }

    // find previous questions asked
    let questionsAsked = 0
    Queue.findById(qid, (err, queue) => {
        if (user.email in queue.asked) {
            questionsAsked = queue.asked[user.email]
        }
    })

    Question.create({
        queue: qid,
        user: user,
        claimed: false,
        claimedInfo: {},
        questionsAsked: questionsAsked
    })
}



// Server sockets
io.on('connect', socket => {

    socket.on('init', (qid) => {
        console.log("joining, ", qid)
        socket.join(qid)
        broadcastQueueData(qid, socket, false)
    })

    // TODO: Awful implementation, need to decompose into individual changes/
    socket.on('change', async (qid, tutor, questionData) => {
        await changeQueueData(qid, tutor, questionData)
        broadcastQueueData(qid, socket, true)
    })

    socket.on('ask', async (qid, user) => {
        await askQuestion(qid, user)
        broadcastQueueData(qid, socket, true)
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
