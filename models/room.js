const mongoose = require('mongoose')

let roomSchema = mongoose.Schema({
    course: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema)