const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middleware/error-handler')
const expenseController = require('../controller/expense-controller')
const userController = require('../controller/user-controller')
const movieController = require('../controller/movie-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const passport = require('passport')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.get('/movies', movieController.getMovies)
router.post('/movies', async (req, res, next) => {
  try {
    const movies = await movieController.postMovies(req, res, next)
    const screenings = await movieController.postScreenings(req, res, next)

    // 在这里发送响应
    res.json({ movies, screenings })
  } catch (err) {
    next(err)
  }
})

router.get('/expenses/create', authenticated, expenseController.createExpense)
router.get('/expenses/:eid/edit', authenticated, expenseController.editExpense)
router.get('/expenses/:eid', authenticated, expenseController.getExpense)
router.put('/expenses/:eid', authenticated, expenseController.putExpense)
router.delete('/expenses/:eid', authenticated, expenseController.deleteExpense)
router.get('/expenses', authenticated, expenseController.getExpenses)
router.post('/expenses', authenticated, expenseController.postExpense)

router.use('/', apiErrorHandler)

module.exports = router
