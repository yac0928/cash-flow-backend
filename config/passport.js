const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User, Subscription, Password } = require('../models/index')
const bcrypt = require('bcryptjs')

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value
    const name = profile.displayName
    let user = await User.findOne({ where: { email }, include: [Subscription] })
    if (!user) {
      user = await User.create({
        name,
        email
      })
      user = await User.findByPk(user.id, { include: [Subscription] })
      const randomPwd = Math.random().toString(36).slice(-8)
      const hash = await bcrypt.hash(randomPwd, 10)
      await Password.create({
        userId: user.id,
        passwordHash: hash
      })
    }
    done(null, user)
  } catch (err) {
    done(err)
  }
}))

module.exports = passport
