export default (req, res) => {

    const {
        query: { course, zone },
    } = req

    if (zone === undefined) {
        res.statusCode = 400
        res.json().send("Must suply zone parameter")
    }

    console.log(course, zone)

    res.json([
        {id: 1, name: 'Long ', weighting: (a, b) => 1},
        {id: 2, name: 'Short', weighting: (a, b) => 1},
        {id: 3, name: 'Gigantic', weighting: (a, b) => 1},
    ])
}