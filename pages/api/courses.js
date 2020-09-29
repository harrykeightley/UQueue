const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/uqueue', { useNewUrlParser: true })

const Course = require('../../models/course')

export default async (req, res) => {
    return new Promise(resolve => {
        Course.find((err, courses) => {
            if (err) {
                res.status(500).json("Couldn't grab courses")
                return resolve()
            } 
            res.status(200).json(courses)
            return resolve()
        })
    })
}