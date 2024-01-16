const express = require('express')
const path = require('path')
const router = express.Router()

const { apiErrorHandler } = require('../middleware/error-handler')
const expenseController = require('../controller/expense-controller')
const userController = require('../controller/user-controller')
const { authenticated } = require('../middleware/api-auth')
const passport = require('passport')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.use('/calendar', express.static(path.join(__dirname, '../public')))
router.get('/expenses/:eid', expenseController.getExpense)
router.get('/expenses', authenticated, expenseController.getExpenses)

router.get('/', (req, res) => res.redirect('/api/calendar'))
router.use('/', apiErrorHandler)

module.exports = router
