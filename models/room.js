const mongoose = require('mongoose')

let roomSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.Model('Room', roomSchema)