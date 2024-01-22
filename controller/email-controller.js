const nodemailer = require('nodemailer')
const { Op } = require('sequelize')
const { User, Subscription } = require('../models')

const emailController = {
  postEmail: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{
          model: Subscription,
          where: {
            level: { [Op.not]: 'none' }
          }
        }]
      })
      if (!users) throw new Error('No users found')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      })

      await transporter.verify()
      for (const user of users) {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: 'testSubject',
          text: 'testText'
        }
        await transporter.sendMail(mailOptions)
      }

      res.status(200).json({
        status: 'success',
        message: 'Emails sent successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = emailController
