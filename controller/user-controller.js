const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Password } = require('../models')

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
        // 然後創建相應的密碼記錄
        return bcrypt.hash(password, 10)
          .then(hash => Password.create({ user_id: newUser.id, password_hash: hash }))
          .then(() => newUser)
      })
      .then(newUser => {
        res.json({ newUser })
      })
      // 不知道下面的寫法可不可以
      // .then(newUser => {
      //   return bcrypt.hash(password, 10)
      //     .then(hash => {
      //       Password.create({ user_id: newUser.id, password_hash: hash })
      //       res.json(newUser)
      //     })
      // })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
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
