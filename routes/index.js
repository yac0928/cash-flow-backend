const express = require('express')
const path = require('path')
const router = express.Router()
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middleware/error-handler')
const expenseController = require('../controller/expense-controller')
const userController = require('../controller/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const passport = require('passport')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.use('/calendar_sample', express.static(path.join(__dirname, '../public')))
router.get('/calendar', authenticated, expenseController.getCalendar)

router.get('/expenses/create', authenticated, expenseController.createExpense)
router.get('/expenses/:eid/edit', authenticated, expenseController.editExpense)
router.get('/expenses/:eid', authenticated, expenseController.getExpense)
router.put('/expenses/:eid', authenticated, expenseController.putExpense)
router.delete('/expenses/:eid', authenticated, expenseController.deleteExpense)
router.get('/expenses', authenticated, expenseController.getExpenses)
router.post('/expenses', authenticated, expenseController.postExpense)

router.get('/', (req, res) => res.redirect('/api/calendar_cample'))
router.use('/', apiErrorHandler)

module.exports = router
