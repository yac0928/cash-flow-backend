const OpenAI = require('openai')
const expenseServices = require('../services/expenseServices')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const aiController = {
  processUserInput: async (userInput, Currentuser) => {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }],
      functions: functionDescriptions,
      function_call: 'auto'
    })

    const apiFunction = response.choices[0].message.function_call.name
    const args = JSON.parse(response.choices[0].message.function_call.arguments)

    let result
    console.log(response.choices[0].message.function_call)

    switch (apiFunction) {
      case 'getExpenses': {
        const { year, month, day } = args
        result = await handleGetExpenses(year, month, day, Currentuser)
        break
      }
      case 'getExpensesByMonth': {
        const { year, month } = args
        result = await handleGetExpensesByMonth(year, month, Currentuser)
        break
      }
      case 'postExpense': {
        const { date, name, amount, categoryId, paymentId, comment } = args
        if (!date || !name || !amount || !categoryId || !paymentId) {
          throw new Error('提供完整的支出信息')
        }
        result = await handlePostExpense(date, name, amount, categoryId, paymentId, comment, Currentuser)
        break
      }
      default:
        throw new Error('無法識別API功能')
    }

    return result
  }
}

const functionDescriptions = [
  {
    name: 'getExpenses',
    description: 'Get expenses information',
    parameters: {
      type: 'object',
      properties: {
        year: {
          type: 'integer',
          description: 'The year of the expense, e.g. 2024'
        },
        month: {
          type: 'integer',
          description: 'The month of the expense, e.g. 1 for January'
        },
        day: {
          type: 'integer',
          description: 'The day of the expense, e.g. 21'
        }
      },
      required: ['year', 'month', 'day']
    }
  },
  {
    name: 'getExpensesByMonth',
    description: 'Get expenses by month',
    parameters: {
      type: 'object',
      properties: {
        year: {
          type: 'integer',
          description: 'The year of the expense, e.g. 2024'
        },
        month: {
          type: 'integer',
          description: 'The month of the expense, e.g. 1 for January'
        }
      },
      required: ['year', 'month']
    }
  },
  {
    name: 'postExpense',
    description: 'Post a new expense',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date',
          description: 'The date of the expense, e.g. 2024-02-21'
        },
        name: {
          type: 'string',
          description: 'The name of the expense, e.g. Netflix membership'
        },
        amount: {
          type: 'integer',
          description: 'The amount of the expense, e.g. 150元'
        },
        categoryId: {
          type: 'integer',
          description: 'The categoryId of the expense, e.g. Entertainment for 1'
        },
        paymentId: {
          type: 'integer',
          description: 'The paymentId of the expense, e.g. cash for 1'
        },
        comment: {
          type: 'integer',
          description: 'The comment of the expense, e.g. I have to pay netflix membership per month'
        }
      },
      required: ['date', 'name', 'amount', 'categoryId', 'paymentId']
    }
  }
]
// const userInput = 'I want to find expenses on 2024-02-21'

async function handleGetExpenses (year, month, day, user) {
  try {
    const result = await new Promise((resolve, reject) => {
      expenseServices.getExpenses({ query: { year, month, day, user } }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    return result
  } catch (error) {
    console.error('getExpenses出錯了：', error)
  }
}
async function handleGetExpensesByMonth (year, month, user) {
  try {
    const result = await new Promise((resolve, reject) => {
      expenseServices.getExpenses({ query: { year, month, user } }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    return result
  } catch (error) {
    console.error('getExpenses出錯了：', error)
  }
}
async function handlePostExpense (date, name, amount, categoryId, paymentId, comment, user) {
  try {
    const result = await new Promise((resolve, reject) => {
      expenseServices.postExpense({ body: { date, name, amount, categoryId, paymentId, comment, user } }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    return result
  } catch (error) {
    console.error('postExpense出錯了：', error)
  }
}

module.exports = aiController
