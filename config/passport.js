const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User, Subscription } = require('../models/index')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => { // 這裡的jwtPayload是從前端攜帶的token，decoded出來的
  User.findByPk(jwtPayload.id, {
    include: [{ model: Subscription }]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
