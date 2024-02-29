const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Password } = require('../models')

// const baseUrl = 'http://localhost:5173'
const baseUrl = 'https://cash-flow.zeabur.app'

const userController = {
  signUp: (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!name) throw new Error('Name is required!')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')
    if (password !== passwordConfirm) throw new Error('Passwords do not match!')
    return User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) throw new Error('The email has been signed up, please select another email!')
        return User.create({
          name,
          email
        })
      })
      .then(newUser => {
        return bcrypt.hash(password, 10)
          .then(hash => Password.create({ userId: newUser.id, passwordHash: hash }))
          .then(() => newUser)
      })
      .then(newUser => {
        res.json({ newUser })
      })
      .catch(err => next(new Error(err.message)))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' })
      res.json({
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  googleSignIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' })
      const redirectUrl = `${baseUrl}/?token=${token}&user=${JSON.stringify(userData)}`
      res.redirect(redirectUrl)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
