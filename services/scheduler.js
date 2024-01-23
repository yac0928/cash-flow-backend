const schedule = require('node-schedule')
const emailController = require('../controller/email-controller')

// 创建定时任务，每天的 00:00 执行
const mailSchedule = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await emailController.postEmail() // 這個程式碼會出錯，因為裡面用到res, next，然而schedule並沒有用到express的路由
  } catch (err) {
    console.error('Error in scheduled task:', err)
  }
})

module.exports = mailSchedule
