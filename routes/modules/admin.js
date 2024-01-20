const express = require('express')
const router = express.Router()

const categoryController = require('../../controller/category-controller')

router.get('/categories/:cid', categoryController.getCategory)
router.put('/categories/:cid', categoryController.putCategory)
router.delete('/categories/:cid', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)

module.exports = router
