const mongoose = require('mongoose')

let questionSchema = mongoose.Schema({
    queue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Queue',
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        name: String,
        username: {
            type: String,
            required: true,
        },
        email: String,
    },
    claimed: Boolean,
    claimedInfo: {
        info: String,
        claimerEmail: String,
    },
    questionsAsked: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema)