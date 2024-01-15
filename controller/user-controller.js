const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!name) throw new Error('Name is required!')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')
    if (password !== passwordConfirm) throw new Error('Passwords do not match!')
    return User.findOne({
      where: email,
      excludes: password
    })
      .then(user => {
        if (user) throw new Error('The email has been signed up, please select another email!')
        return User.create({
          name,
          email,
          password: bcrypt.hash(password, 10)
        })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
