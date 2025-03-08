const express = require('express')
const cors = require('cors')

const yield = require('./router/yield')

const app = express()

app.use(cors())

app.use("/yield", yield)

app.listen(5000, () => {
    console.log("server running")
})