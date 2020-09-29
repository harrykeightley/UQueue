import { json } from 'express'

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/uqueue', { useNewUrlParser: true })

let Room = require('../../../models/room')

export default async (req, res) => {
    const {
        query: { course },
    } = req

    // Create some dummy data
    // await Room.findOne({course: course, name: 'External'}, (err, room) => {
    //     console.log(room)
    //     if (!room) {
    //         var r = new Room({course: course, name: 'External'})
    //         r.save()    
    //     }
    // })

    return new Promise((resolve, reject) => {
        Room.find({course: course}, (err, rooms) => {
            if (err) {
                res.status(500).json({error: err})
                reject(err)
            }
            res.status(200).json(rooms)
            resolve()
        })
    }) 
}