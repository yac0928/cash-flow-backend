const daysTag = document.querySelector('.days')
const currentDate = document.querySelector('.current-date')
const prevNextIcon = document.querySelectorAll('.icons span')

// getting new date, current year and month
let date = new Date()
let currYear = date.getFullYear()
let currMonth = date.getMonth()

// storing full name of all months in array
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']

const renderCalendar = () => {
  const firstDayofMonth = new Date(currYear, currMonth, 1).getDay() // getting first day of month
  const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate() // getting last date of month
  const lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay() // getting last day of month
  const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate() // getting last date of previous month
  let liTag = ''

  for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`
  }

  for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
    // adding active class to li if the current day, month, and year matched
    const isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? 'active' : ''
    liTag += `<li class="${isToday}">${i}</li>`
  }

  for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
  }
  currentDate.innerText = `${months[currMonth]} ${currYear}` // passing current mon and yr as currentDate text
  daysTag.innerHTML = liTag
}
renderCalendar()

prevNextIcon.forEach(icon => { // getting prev and next icons
  icon.addEventListener('click', () => { // adding click event on both icons
    // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
    currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1

    if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
      // creating a new date of current year & month and pass it as date value
      date = new Date(currYear, currMonth, new Date().getDate())
      currYear = date.getFullYear() // updating current year with new date year
      currMonth = date.getMonth() // updating current month with new date month
    } else {
      date = new Date() // pass the current date as date value
    }
    renderCalendar() // calling renderCalendar function
  })
})
// 點擊日期redirect
document.addEventListener('DOMContentLoaded', function () {
  const dateElements = document.querySelectorAll('.days li')
  dateElements.forEach(element => {
    element.addEventListener('click', function () {
      const clickedDate = this.innerText

      // 獲取當前年份和月份
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1 // JavaScript 中月份是從 0 開始的，所以要加 1

      // 使用 window.location.href 進行重定向，包含年月和日期
      window.location.href = `/details?year=${currentYear}&month=${currentMonth}&date=${clickedDate}`
    })
  })
})
