const mongoose = require('mongoose')

let courseSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    staff: [{
        email: {
            type: String, 
            required: true
        },
        role: {
            type: String,
            required: true
        }
    }],
})

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);