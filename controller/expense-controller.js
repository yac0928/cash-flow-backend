const { Expense, Category } = require('../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { postNextFewYearsExpense } = require('../helpers/post-expenses-helpers')

const expenseController = {
  getCalendar: (req, res, next) => {
    return Expense.findAll({
      where: {
        userId: req.user.id
      }
    })
      .then(expenses => res.json({ expenses }))
      .catch(err => next(err))
  },
  getExpenses: (req, res, next) => {
    const { year, month, day, categoryId } = req.query
    return Promise.all([
      Expense.findAll({
        where: {
          userId: req.user.id,
          date: {
            [Op.eq]: new Date(`${year}-${month}-${day}`)
          },
          ...categoryId ? { categoryId } : {}
        },
        include: [Category]
      }),
      Category.findAll()
    ])
      .then(([expenses, categories]) => {
        const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0) // 前端處理user是否訂閱
        res.json({ expenses, categories, categoryId, totalAmount })
      })
      .catch(err => next(err))
  },
  getExpense: (req, res, next) => {
    const { eid } = req.params
    return Expense.findByPk(eid)
      .then(expense => {
        if (!expense) throw new Error('The expense doesn\'t exist!')
        if (expense.userId !== req.user.id) throw new Error('You don\'t have permission to view this expense!')
        res.json({ expense })
      })
      .catch(err => next(err))
  },
  postExpense: (req, res, next) => {
    const { date, name, amount, categoryId, paymentId, paymentMonth, comment } = req.body
    const userId = req.user.id
    const userSubLevel = req.user.Subscription.level
    const groupId = uuidv4()
    const YEAR = 1
    if (!date) throw new Error('Date is required!')
    if (!name) throw new Error('Name is required!')
    if (!amount) throw new Error('Amount is required!')
    if (!categoryId) throw new Error('Category is required!')
    if (!paymentId) throw new Error('PaymentId is required!')
    return Expense.create({
      date,
      name,
      amount,
      categoryId,
      paymentId,
      paymentMonth,
      comment,
      userId, // 非必填，因為是已經定義的欄位
      group: groupId
    })
      .then(newExpense => {
        if (userSubLevel === 'none') return res.json({ newExpense }) // 如果條件成立，會跳出TypeError: 循環引用錯誤
        return postNextFewYearsExpense(newExpense, YEAR)
      })
      .then(newExpenses => {
        if (newExpenses) res.json({ newExpenses })
      })
      .catch(err => next(err))
  },
  putExpense: (req, res, next) => {
    const { eid } = req.params
    const { date, name, amount, categoryId, comment } = req.body
    if (!date) throw new Error('Date is required!')
    if (!name) throw new Error('Name is required!')
    if (!amount) throw new Error('Amount is required!')
    if (!categoryId) throw new Error('Category is required!')
    return Expense.findByPk(eid)
      .then(expense => {
        if (!expense) throw new Error('The expense doesn\'t exist!')
        if (expense.userId !== req.user.id) throw new Error('You don\'t have permission to edit this expense!')
        return Expense.findAll({
          where: {
            group: expense.group,
            date: { [Op.gte]: expense.date }
          }
        })
      })
      .then(expenses => {
        const updatePromises = expenses.map(e => e.update({
          name,
          amount,
          categoryId,
          comment
        }))
        return Promise.all(updatePromises)
      })
      .then(updatedExpense => res.json({ updatedExpense }))
      .catch(err => next(err))
  },
  deleteExpense: (req, res, next) => {
    const { eid } = req.params
    return Expense.findByPk(eid)
      .then(expense => {
        if (!expense) throw new Error('The expense doesn\'t exist!')
        if (expense.userId !== req.user.id) throw new Error('You don\'t have permission to delete this expense!')
        return expense.destroy()
      })
      .then(deletedExpense => res.json({ deletedExpense }))
      .catch(err => next(err))
  }
}
module.exports = expenseController
