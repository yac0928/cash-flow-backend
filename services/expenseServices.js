const { Expense, Category, Payment } = require('../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { postcbFewYearsExpense } = require('../helpers/post-expenses-helpers')

const expenseServices = {
  getCalendar: (req, cb) => {
    return Expense.findAll({
      where: {
        userId: req.user.id
      }
    })
      .then(expenses => cb(null, { expenses }))
      .catch(err => cb(err))
  },
  getExpenses: (req, cb) => {
    const { year, month, day, categoryId, user } = req.query
    return Promise.all([
      Expense.findAll({
        where: {
          userId: req.user ? req.user.id : user.id,
          date: {
            [Op.eq]: new Date(Date.UTC(year, month - 1, day))
          },
          ...categoryId ? { categoryId } : {}
        },
        include: [Category]
      }),
      Category.findAll()
    ])
      .then(([expenses, categories]) => {
        const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0) // 前端處理user是否訂閱
        cb(null, { expenses, categories, categoryId, totalAmount })
      })
      .catch(err => cb(err))
  },
  getExpensesByMonth: (req, cb) => {
    const { year, month, categoryId, user } = req.query
    return Promise.all([
      Expense.findAll({
        where: {
          userId: req.user ? req.user.id : user.id,
          date: {
            [Op.and]: [
              { [Op.gte]: new Date(Date.UTC(year, month - 1, 1)) },
              { [Op.lt]: new Date(Date.UTC(year, month, 1)) }
            ]
          },
          ...categoryId ? { categoryId } : {}
        },
        include: [Category]
      }),
      Category.findAll()
    ])
      .then(([expenses, categories]) => {
        const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0) // 前端處理user是否訂閱
        cb(null, { expenses, categories, categoryId, totalAmount })
      })
      .catch(err => cb(err))
  },
  getExpense: async (req, cb) => {
    try {
      const { eid } = req.params
      const expense = await Expense.findByPk(eid, { include: [Category, Payment] })
      if (!expense) {
        throw new Error('The expense doesn\'t exist!')
      }
      if (expense.userId !== req.user.id) {
        throw new Error('You don\'t have permission to view this expense!')
      }

      // 找到相同 group 的所有记录，但不包括当前的 expense
      const expenses = await Expense.findAll({
        where: {
          group: expense.group,
          userId: req.user.id,
          id: { [Op.ne]: expense.id } // 排除当前 expense
        },
        include: [Category, Payment]
      })

      cb(null, { expense, expenses })
    } catch (err) {
      cb(err)
    }
  },
  editExpense: (req, cb) => {
    const { eid } = req.params
    return Promise.all([
      Expense.findByPk(eid, { include: [Category, Payment] }),
      Category.findAll({ raw: true }),
      Payment.findAll({ raw: true })
    ])
      .then(([expense, categories, payments]) => {
        if (!expense) throw new Error('Expense didn\'t exist')
        cb(null, { expense, categories, payments })
      })
      .catch(err => cb(err))
  },
  createExpense: (req, cb) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      Payment.findAll({ raw: true })
    ])
      .then(([categories, payments]) => {
        cb(null, { categories, payments })
      })
      .catch(err => cb(err))
  },
  postExpense: (req, cb) => {
    const { date, name, amount, categoryId, paymentId, paymentYears, paymentPerMonth, comment, user } = req.body || req
    const userId = req.user ? req.user.id : user.id
    const userSubLevel = req.user ? req.user.Subscription.level : user.Subscription.level
    const groupId = uuidv4()
    if (!date) throw new Error('Date is required!')
    if (!name) throw new Error('Name is required!')
    if (amount === null || amount === undefined) throw new Error('Amount is required!') // tricky，(!amount)如果0會失敗
    if (!categoryId) throw new Error('Category is required!')
    if (!paymentId) throw new Error('PaymentId is required!')
    // 如果沒訂閱||year===0，不用建group，且直接建立一個expense
    let createGroup = false
    if (userSubLevel !== 'none') {
      if (paymentYears > 0) {
        createGroup = true
      }
    }
    const groupData = createGroup ? { group: groupId } : {}
    return Expense.create({
      date,
      name,
      amount,
      categoryId,
      paymentId,
      paymentYears,
      paymentPerMonth,
      comment,
      userId, // 非必填，因為是已經定義的欄位
      ...groupData
    })
      .then(newExpenses => {
        if (createGroup === false) return cb(null, { newExpenses })
        return postcbFewYearsExpense(newExpenses, paymentYears)
          .then(newExpenses => {
            if (newExpenses) cb(null, { newExpenses })
          })
      })
      .catch(err => cb(err))
  },
  putExpense: (req, cb) => {
    const { eid } = req.params
    const { date, name, amount, categoryId, paymentId, comment } = req.body
    if (!name) throw new Error('Name is required!')
    if (!amount) throw new Error('Amount is required!')
    if (!categoryId) throw new Error('Category is required!')
    if (!paymentId) throw new Error('PaymentId is required!')
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
          paymentId,
          comment
        }))
        return Promise.all(updatePromises)
      })
      .then(updatedExpense => cb(null, { updatedExpense, date }))
      .catch(err => cb(err))
  },
  deleteExpense: (req, cb) => {
    const { eid } = req.params
    return Expense.findByPk(eid)
      .then(expense => {
        if (!expense) throw new Error('The expense doesn\'t exist!')
        if (expense.userId !== req.user.id) throw new Error('You don\'t have permission to delete this expense!')
        if (!expense.group) {
          return expense.destroy()
            .then(deletedExpenses => cb(null, { deletedExpenses }))
        }
        return Expense.findAll({
          where: {
            group: expense.group, date: { [Op.gte]: expense.date }
          }
        })
          .then(expenses => {
            const deletedPromises = expenses.map(e => e.destroy())
            return Promise.all(deletedPromises)
          })
          .then(deletedExpenses => cb(null, { deletedExpenses }))
          .catch(err => cb(err))
      })
  }
}
module.exports = expenseServices
