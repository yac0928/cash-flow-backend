const express = require('express')
const router = express.Router()

const categoryController = require('../../controller/category-controller')
const { postEmails } = require('../../utils/emailUtils')

router.get('/categories/:cid', categoryController.getCategory)
router.put('/categories/:cid', categoryController.putCategory)
router.delete('/categories/:cid', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)

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
