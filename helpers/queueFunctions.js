/** 
 * Important functions that get called when data changes on the queues. 
 * 
 * The general idea is that they'll make a database query and respond by broad-
 * casting the most updated queue data to all sockets which required it for that
 * specific queue.
 */

const Question = require('../models/question')
const Queue = require('../models/queue')
const DEBUG = false

// tell all listening sockets the current queue state
function broadcast(qid, socket, toAll) {
    Question.find({ queue: qid }, (err, questions) => {
        if (err) {
            return console.log("Problem getting guestions from ", qid)
        }

        if (toAll) {
            socket.to(qid).emit('change', { questions, qid })
        }
        socket.emit('change', { questions, qid })
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
            await Question.findById(id, (err, dbQuestion) => {
                if (err) console.log(err);

                if (!dbQuestion.claimed) {
                    dbQuestion.claimed = true,
                    dbQuestion.claimedInfo = question.claimedInfo
                    dbQuestion.save()
                } else if (DEBUG) {
                    console.log("Question already claimed by another tutor: ", dbQuestion.claimedInfo.claimer)
                }
            });
            // Old claim TODO delete once sure this works
            // await Question.findByIdAndUpdate(id, { claimed: true, claimedInfo: question.claimedInfo }, () => { })
            break
        case 'UNCLAIM':
            await Question.findByIdAndUpdate(id, { claimed: false, claimedInfo: {}}, () => { })

    }

    DEBUG && console.log("Making change: ", type, question)
}

async function generateQuestion(qid, user, socket) {
    // find previous questions asked
    Queue.findById(qid, (err, queue) => {
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
        }, (err, question) => {
            if (err) console.log(err)
            DEBUG && console.log('Created question hopefully: ', question, user)
            broadcast(qid, socket, true) // update the queue
        })
    })
}

async function askQuestion(qid, user, socket) {
    // Check if they're already in the queue
    DEBUG && console.log('Asking a question from', user)
    Question.findOne({ queue: qid, 'user.user': user.user }, async (err, question) => {
        if (err) console.log(err)
        if (!question) {
            generateQuestion(qid, user, socket)
        }
    })
}

module.exports = { broadcast, askQuestion, change }