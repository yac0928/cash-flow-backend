const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const { User } = require('../models/index')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (username, password, cb) => {
    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) return cb(null, false, { message: 'Incorrect email or password' })
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false, { message: 'Incorrect email or password' })
            return cb(null, user)
          })
      })
      .catch(err => cb(err))
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
