const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middleware/error-handler')
const expenseController = require('../controller/expense-controller')
const userController = require('../controller/user-controller')
const movieController = require('../controller/movie-controller')
const categoryController = require('../controller/category-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { authenticateUser } = require('../middleware/login-auth')

const auth = require('./modules/auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/auth', auth)

router.post('/signin', authenticateUser, userController.signIn)
router.post('/signup', userController.signUp)

router.get('/movies', movieController.getMovies)
router.post('/movies', movieController.postMoviesAndScreenings)

router.get('/expenses/create', authenticated, expenseController.createExpense)
router.get('/expenses/:eid/edit', authenticated, expenseController.editExpense)
router.get('/expenses/:eid', authenticated, expenseController.getExpense)
router.put('/expenses/:eid', authenticated, expenseController.putExpense)
router.delete('/expenses/:eid', authenticated, expenseController.deleteExpense)
router.get('/expenses', authenticated, expenseController.getExpenses)
router.get('/expenses-by-month', authenticated, expenseController.getExpensesByMonth)
router.post('/expenses', authenticated, expenseController.postExpense)

router.get('/categories/:cid', categoryController.getCategory)
router.put('/categories/:cid', categoryController.putCategory)
router.delete('/categories/:cid', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)

router.get('/', authenticated, expenseController.getCalendar)
router.use('/', apiErrorHandler)

module.exports = router
