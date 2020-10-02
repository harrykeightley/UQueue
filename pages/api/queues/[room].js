const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/uqueue', { useNewUrlParser: true })

let Queue = require('../../../models/queue')

export default async (req, res) => {

    const {
        query: { room },
    } = req

    // Create some dummy data
    // await Queue.findOne({room: room}, (err, queue) => {
    //     if (!queue) {
    //         var q = new Queue({
    //             room: room, 
    //             name: 'Long Questions',
    //             asked: {}
    //         })
    //         q.save()    
    //     }
    // })

    return new Promise((resolve, reject) => {
        Queue.find({room: room}, (err, queues) => {
            if (err) {
                res.status(500).json("Couldn't load queues")
                reject(err)
            }
    
            res.status(200).json(queues)
            resolve()
        })
    })    
}