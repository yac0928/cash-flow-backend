const OpenAI = require('openai')
const expenseServices = require('../services/expenseServices')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
          type: 'string',
          description: 'The comment of the expense, e.g. I have to pay netflix membership per month'
        }
      },
      required: ['date', 'name', 'amount', 'categoryId', 'paymentId']
    }
  }
]
async function callFunction (functionCall, Currentuser) {
  const args = JSON.parse(functionCall.arguments)
  switch (functionCall.name) {
    case 'getExpenses': {
      const { year, month, day } = args
      return await handleGetExpenses(year, month, day, Currentuser)
    }
    case 'getExpensesByMonth': {
      const { year, month } = args
      return await handleGetExpensesByMonth(year, month, Currentuser)
    }
    case 'postExpense': {
      const { date, name, amount, categoryId, paymentId, comment } = args
      return await handlePostExpense(date, name, amount, categoryId, paymentId, comment, Currentuser)
    }
    default:
      throw new Error('無法識別API功能為新增或查詢')
  }
}
const aiController = {
  userTempMessages: {},

  processUserInput: async (userInput, Currentuser) => {
    if (!aiController.userTempMessages[Currentuser.id]) {
      aiController.userTempMessages[Currentuser.id] = []
    }
    let currentUserTempMessages = aiController.userTempMessages[Currentuser.id]
    console.log(aiController.userTempMessages)
    currentUserTempMessages.push({ role: 'user', content: userInput })
    const messages = [
      {
        role: 'system',
        content:
          "You're a cash-flow app assistant, you can search or create expenses. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. If the user's request is complete, confirm the function you're going to execute with the user first, if the user type some confirmative words, then call the function."
      },
      ...currentUserTempMessages
    ]

    console.log('messages: ', messages)
    const chatResponse = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      functions: functionDescriptions
    })
    const assistantMessage = chatResponse.choices[0].message

    console.log('assistantMessage: ', assistantMessage)
    // 確認是否有功能呼叫
    if (!assistantMessage.function_call) {
      currentUserTempMessages.push(assistantMessage)
      console.log('outputByContent: ', currentUserTempMessages)
      return currentUserTempMessages
    }

    const result = await callFunction(assistantMessage.function_call, Currentuser)
    const outputMessage = {
      role: 'function',
      name: assistantMessage.function_call.name,
      content: JSON.stringify(result)
    }
    currentUserTempMessages = []
    return outputMessage
  }
}

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
