const { Expense } = require('../models')
const { Op } = require('sequelize')
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
    const { year, month, date } = req.query
    return Expense.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.eq]: new Date(`${year}-${month}-${date}`)
        }
      }
    })
      .then(expenses => res.json({ expenses }))
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
    const { date, name, amount, categoryId, comment } = req.body
    const userId = req.user.id
    if (!date) throw new Error('Date is required!')
    if (!name) throw new Error('Name is required!')
    if (!amount) throw new Error('Amount is required!')
    if (!categoryId) throw new Error('Category is required!')
    return Expense.create({
      date,
      name,
      amount,
      categoryId,
      comment,
      userId // 好像非必填，因為是已經定義的欄位
    })
      .then(newExpense => {
        res.json({ newExpense })
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
        return expense.update({
          date,
          name,
          amount,
          categoryId,
          comment
        })
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
