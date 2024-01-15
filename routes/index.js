const express = require('express')
const path = require('path')
const router = express.Router()

const detailController = require('../controller/detail-controller')

router.get('/login')

router.use('/calendar', express.static(path.join(__dirname, '../public')))
router.get('/details', detailController.getDetail)

router.get('/', (req, res) => res.redirect('/calendar'))

module.exports = router
