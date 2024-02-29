const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Password, UserCategory } = require('../models')

// const baseUrl = 'http://localhost:5173'
const baseUrl = 'https://cash-flow.zeabur.app'

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordConfirm } = req.body

      if (!name) throw new Error('Name is required!')
      if (!email) throw new Error('Email is required')
      if (!password) throw new Error('Password is required')
      if (password !== passwordConfirm) throw new Error('Passwords do not match!')

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) throw new Error('The email has been signed up, please use another email!')

      const newUser = await User.create({ name, email })
      await UserCategory.bulkCreate([
        { userId: newUser.id, categoryId: 1 },
        { userId: newUser.id, categoryId: 2 },
        { userId: newUser.id, categoryId: 3 }
      ])

      const hash = await bcrypt.hash(password, 10)
      await Password.create({ userId: newUser.id, passwordHash: hash })

      res.json({ newUser })
    } catch (err) {
      next(new Error(err.message))
    }
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
