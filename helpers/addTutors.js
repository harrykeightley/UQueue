var tutors = [
	uqhkeigh,
	uqbwebb2,
	uqecavil,
	uqpgrov1,
	uqdjon14,
	uqldeaki,
	uqlkarst,
	uqalim8,
	uqaric13,
	uqjmor24,
	uqmpham6,
	uqkbart5,
].map(username => {
	return { user: username, role: 'tutor'}
});

conn = new Mongo()
db = conn.getDB('uqueue')
db.courses.update({name: "CSSE1001"}, {$set: {staff: tutors}})
