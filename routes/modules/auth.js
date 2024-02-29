const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controller/user-controller')

router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  userController.googleSignIn
)

module.exports = router
