/** Mongo script that should be executed once a day to clear all questions. */
conn = new Mongo()
db = conn.getDB('uqueue')
db.queues.updateMany({}, {$set: {asked: {}}})