const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!name) throw new Error('Name is required!')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')
    if (password !== passwordConfirm) throw new Error('Passwords do not match!')
    return User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (user) throw new Error('The email has been signed up, please select another email!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      })
      )
      .then(newUser => {
        newUser = newUser.toJSON()
        delete newUser.password
        res.json({ newUser })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
