// 從'X月X日'推測出年份並轉為Date()格式
const getDate = dateString => {
  const [, monthStr, dayStr] = dateString.match(/(\d+)月(\d+)日/)
  const dataMonth = parseInt(monthStr, 10)
  const dataDay = parseInt(dayStr, 10)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  let year = currentDate.getFullYear()
  if (currentMonth >= 10 && dataMonth <= 3) {
    year += 1
  }
  const date = new Date(Date.UTC(year, dataMonth - 1, dataDay))
  return date
}
module.exports = { getDate }
