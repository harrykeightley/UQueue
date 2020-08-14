export default (req, res) => {

    const {
        query: { course, zone },
    } = req

    if (zone === undefined) {
        res.statusCode = 400
        res.json().send("Must suply zone parameter")
    }

    console.log(course, zone)

    if (zone === 'External') {
        res.json([
            {id: 1, name: 'Long ', weighting: (a, b) => 1},
            {id: 2, name: 'Short', weighting: (a, b) => 1},
        ])
    } else if (zone === 'Flexible') {
        res.json([
            {id: 1, name: 'Flexible ', weighting: (a, b) => 1},
            {id: 2, name: 'Short', weighting: (a, b) => 1},
        ])
    } else {
        res.json([
            {id: 1, name: 'Reee ', weighting: (a, b) => 1},
            {id: 2, name: 'Short', weighting: (a, b) => 1},
        ])
    }
    
}