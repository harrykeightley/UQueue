const Question = require('./models/question')
const Queue = require('./models/queue')
const DEBUG = true

// tell all listening sockets the current queue state
function broadcast(qid, socket, toAll) {
    Question.find({ queue: qid }, (err, questions) => {
        if (err) {
            return console.log("Problem getting guestions from ", qid)
        }
        var recipients = toAll ? socket.to(qid) : socket
        recipients.emit('change', questions)
    })
}

// modify queue data
async function change(qid, tutor, questionData) {
    const { type, question } = questionData
    const id = question._id

    switch (type) {
        case 'TICK':
            var query = question.user.user
            await Queue.findById(qid, (err, queue) => {
                if (err) console.log(err);
                queue.asked.set(query, question.questionsAsked + 1)
                queue.save()
            });
        case 'REMOVE':
            await Question.findByIdAndDelete(id, () => { })
            break
        case 'CLAIM':
            await Question.findByIdAndUpdate(id, { claimed: true, claimedInfo: question.claimedInfo }, () => { })
    }
}

async function generateQuestion(qid, user, socket) {
    // find previous questions asked
    Queue.findById(qid, (err, queue) => {
        DEBUG && console.log('Finding queue with id: ', qid)

        let questionsAsked = 0
        if (queue.asked.has(user.user)) {
            questionsAsked = queue.asked.get(user.user)
        }
        Question.create({
            queue: qid,
            user: user,
            claimed: false,
            claimedInfo: {},
            questionsAsked: questionsAsked
        }, () => {
            DEBUG && console.log('Created question hopefully')
            broadcast(qid, socket, true) // update the queue
        })
    })
}

async function askQuestion(qid, user, socket) {
    // Check if they're already in the queue
    DEBUG && console.log('Asking a question from', user)
    Question.findOne({ queue: qid, 'user.email': user.email }, async (err, question) => {
        if (err) console.log(err)
        if (!question) {
            DEBUG && console.log('No questions found with that email, making one')
            generateQuestion(qid, user, socket)
        }
    })
}

module.exports = { broadcast, askQuestion, change }