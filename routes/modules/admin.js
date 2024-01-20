const express = require('express')
const router = express.Router()

const categoryController = require('../../controller/category-controller')

router.get('/categories/:cid', categoryController.getCategory)
router.put('/categories/:cid', categoryController.putCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)

module.exports = router
