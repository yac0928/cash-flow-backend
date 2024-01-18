const express = require('express')
const router = express.Router()

const categoryController = require('../../controller/category-controller')

router.get('/categories', categoryController.getCategories)

module.exports = router
