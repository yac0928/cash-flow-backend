if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const session = require('express-session')
const cors = require('cors')
// eslint-disable-next-line no-unused-vars
// const mailSchedule = require('./services/scheduler') // 自動發信系統

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 確保passport.user存在
app.use(passport.session()) // 如果passport.user存在，得以執行deserializeUser

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
module.exports = app
