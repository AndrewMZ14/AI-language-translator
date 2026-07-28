const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/data', (req, res) => {
    res.json({data:"hello"})
})
app.listen(3000)
