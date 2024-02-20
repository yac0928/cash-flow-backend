const schedule = require('node-schedule')
const { postEmails } = require('../utils/emailUtils')
const { postMovies, postScreenings } = require('../utils/movieUtils')

const mailSchedule = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await postEmails()
  } catch (err) {
    console.error('Error in scheduled task:', err)
  }
})

const movieSchedule = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    const movies = await postMovies()
    const screenings = await postScreenings()
    console.log('Movies and screenings post successfully: ', { movies, screenings })
  } catch (err) {
    console.log('Movies and screenings post failed: ', err)
  }
})

module.exports = { mailSchedule, movieSchedule }
