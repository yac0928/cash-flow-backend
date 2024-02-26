const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controller/user-controller')

router.get('/google',
  passport.authenticate('google', { session: false, scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', { session: false }, userController.signIn))

module.exports = router
