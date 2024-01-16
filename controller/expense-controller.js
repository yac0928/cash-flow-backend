const { Expense } = require('../models')
const { Op } = require('sequelize')

const expenseController = {
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
        res.json({ expense })
      })
  }
}
module.exports = expenseController
