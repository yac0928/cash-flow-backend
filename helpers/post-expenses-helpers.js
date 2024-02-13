const { Expense } = require('../models')

const postNextFewYearsExpense = async (baseExpense, years) => {
  baseExpense = baseExpense.toJSON()
  const baseYear = baseExpense.date.getFullYear()
  const baseMonth = baseExpense.date.getMonth() // 0-11
  const baseDate = baseExpense.date.getDate()
  const paymentPerMonth = parseInt(baseExpense.paymentPerMonth) // x個月扣款一次
  const amountOfExpenses = years * 12 / paymentPerMonth - 1 // 扣除第一次(已被加入)
  const newExpenses = [baseExpense]
  let currYear = baseYear
  let currMonth = baseMonth
  let currExpenseDate
  for (let i = 0; i < amountOfExpenses; i++) {
    currMonth += paymentPerMonth
    if (currMonth <= 11) {
      currExpenseDate = new Date(Date.UTC(currYear, currMonth, baseDate))
    } else {
      currMonth -= 12
      currYear += 1
      currExpenseDate = new Date(Date.UTC(currYear, currMonth, baseDate))
    }
    const newExpense = {
      ...baseExpense,
      id: baseExpense.id + i + 1,
      date: currExpenseDate
    }
    newExpenses.push(newExpense)
    await Expense.create(newExpense)
  }
  return newExpenses
}

module.exports = {
  postNextFewYearsExpense
}
