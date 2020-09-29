const mongoose = require('mongoose')

// Might want to refactor users somehow
let queueSchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    questions: [{
        date: {
            type: Date,
            default: Date.now
        },
        user: {
            name: String,
            userName: {
                type: String,
                required: true,
            },
            email: String,
        },
        claimed: Boolean,
        claimedInfo: {
            info: String,
            claimerEmail: String,
        }
    }],
    asked: {
        user: {
            name: String,
            userName: {
                type: String,
                required: true,
            },
            email: String,
            rquired: true,
        },
        questionsAsked: {
            type: Number,
            default: 0,
            required: true,
        }
    }
})

module.exports = mongoose.Model("Queue", queueSchema)