var tutors = [
	"uqhkeigh",
	"uqbwebb2",
	"uqecavil",
	"uqpgrov1",
	"uqdjon14",
	"uqldeaki",
	"uqlkarst",
	"uqalim8",
	"uqaric13",
	"uqjmor24",
	"uqmpham6",
	"uqkbart5",
	"uqwkong",
	"uqacoop8",
	"uqjarno4",
	"uqjluong",
	"uqjstore",
].map(username => {
	return { user: username, role: 'tutor'}
});

conn = new Mongo()
db = conn.getDB('uqueue')
db.courses.update({code: "CSSE1001"}, {$set: {staff: tutors}})
