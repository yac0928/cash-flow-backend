const nodemailer = require('nodemailer')

const emailController = {
  postEmail: async (req, res, next) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })

    await transporter.verify()

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'zxcv104302053@gmail.com',
      subject: 'testSubject',
      text: 'testText'
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        next(err)
      } else {
        res.json({ info })
      }
    })
  }
}
module.exports = emailController
