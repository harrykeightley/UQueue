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
    asked: {
        type: Map,
        of: Number
    }
})

module.exports = mongoose.models.Queue ||mongoose.model("Queue", queueSchema)