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
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        user: String,
    },
    claimed: Boolean,
    claimedInfo: {
        info: String,
        claimer: String,
    },
    questionsAsked: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema)