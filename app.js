const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
module.exports = app
