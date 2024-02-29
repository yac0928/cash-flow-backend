const bcrypt = require('bcryptjs')
const { User, Subscription, Password, Category } = require('../models')

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      where: { email },
      include: [Subscription, Password, { model: Category, as: 'Categories' }]
    })

    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.Password.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' })
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { authenticateUser }
