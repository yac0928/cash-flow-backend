const nodemailer = require('nodemailer')
const { Op } = require('sequelize')
const moment = require('moment')
const { User, Subscription, Expense } = require('../models')

const postEmails = async () => {
  try {
    const today = new Date(moment.utc().format('YYYY-MM-DD'))
    const users = await User.findAll({
      include: [{
        model: Subscription,
        where: {
          level: { [Op.not]: 'none' }
        }
      }, {
        model: Expense,
        where: {
          date: today
        }
      }]
    })
    if (users.length === 0) throw new Error('No users found') // if (!users) 就算是[]也是truthy，所以不能這樣用
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })
    await transporter.verify()
    for (const user of users) {
      for (const expense of user.Expenses) {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: expense.name,
          text: `You have an incoming expense on ${expense.date.toLocaleDateString()}\n${expense.name}: $${expense.amount}`
        }
        await transporter.sendMail(mailOptions)
      }
    }
    console.log('Emails sent successfully')
  } catch (err) {
    console.error('Error sending emails:', err)
  }
}

module.exports = { postEmails }
