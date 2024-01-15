const { Expense } = require('../models')
const { Op } = require('sequelize')

const detailController = {
  getDetail: (req, res, next) => {
    const { year, month, date } = req.query
    return Expense.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.eq]: new Date(`${year}-${month}-${date}`)
        }
      }
    })
      .then(expenses => res.json(expenses.toJSON()))
      .catch(err => next(err))
  }
}
module.exports = detailController
