export default (req, res) => {


    const {
        query: { course },
    } = req

    res.json([
        {id: 1, name: 'External'},
        {id: 2, name: 'Flexible'},
        {id: 3, name: 'Other'},
    ])
}