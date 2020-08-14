export default (req, res) => {
    res.statusCode = 200
    res.json([
        {id: 1, title: 'CSSE1001'},
        {id: 2, title: 'CSSE2002'},
        {id: 3, title: 'CSSE3001'},
        {id: 4, title: 'CSSE1004'},
        {id: 5, title: 'CSSE1009'}
    ])
  }