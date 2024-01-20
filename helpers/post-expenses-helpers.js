const { Expense } = require('../models')
const postNextFewYearsExpense = async (baseExpense, years = 0) => {
  const baseYear = baseExpense.date.getFullYear()
  const baseMonth = baseExpense.date.getMonth() // 0-11
  const baseDate = baseExpense.date.getDate()
  const x = baseExpense.paymentMonth // x個月扣款一次
  const amountOfExpenses = years * 12 / x
  const newExpenses = []
  for (let i = 0; i < amountOfExpenses; i++) {
    let currYear = baseYear
    let currMonth = baseMonth
    let currExpenseDate
    if (currMonth <= 11) {
      currExpenseDate = new Date(currYear, currMonth, baseDate)
    } else {
      currMonth -= 12
      currYear += 1
      currExpenseDate = new Date(currYear, currMonth, baseDate)
    }
    const newExpense = {
      ...baseExpense,
      date: currExpenseDate
    }
    newExpenses.push(newExpense)
    currMonth += x
    await Expense.create(newExpense)
  }
  return newExpenses
}

module.exports = {
  postNextFewYearsExpense
}
