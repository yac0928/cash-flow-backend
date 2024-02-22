const express = require('express')
const router = express.Router()

const { postEmails } = require('../../utils/emailUtils')

router.post('/emails', async (req, res, next) => {
  try {
    await postEmails()
    res.status(200).json({ message: 'Emails sent successfully' })
  } catch (err) {
    console.error('Error sending emails: ', err)
    res.status(500).json({ message: 'Failed to send emails' })
  }
})

module.exports = router
