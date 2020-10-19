const course = 'CSSE1001'
const roomName = 'In Person'

conn = new Mongo()
db = conn.getDB('uqueue')
db.rooms.insert({ course: course, name: roomName })

room = db.rooms.findOne({ course: course, name: roomName })
db.queues.insertMany([
    {
        room: room._id,
        name: "Short Questions",
        description: "For questions under 2 minutes.",
        asked: {},
    },
    {
        room: room._id,
        name: "Long Questions",
        description: "For questions over 2 minutes.",
        asked: {},
    }
])