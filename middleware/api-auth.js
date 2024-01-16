const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = user
    if (err || !(user && user.isFrontend)) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized or invalid token' })
    }
    next()
  })(req, res, next)
}
module.exports = { authenticated }
