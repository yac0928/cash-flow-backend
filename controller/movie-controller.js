const axios = require('axios')
const cheerio = require('cheerio')
const { Movie, Screening } = require('../models')
const { getDate } = require('../helpers/get-date')

const MIRAMAR_URL = 'https://www.miramarcinemas.tw/timetable'

const movieController = {
  getMovies: (req, res, next) => {
    return Movie.findAll({ include: [Screening] })
      .then(movies => res.json({ movies }))
      .catch(err => next(err))
  },
  postMovies: async (req, res, next) => {
    try {
      const response = await axios.get(MIRAMAR_URL)
      const html = response.data
      const $ = cheerio.load(html)
      const newMovies = []

      for (const element of $('section:not(#inav, #page_top, .page_title, #footer)').toArray()) {
        const name = $(element).find('.title').text().trim()
        const nameEn = $(element).find('.title_en').text().trim()
        const duration = $(element).find('.time').text().trim()
        const description = $(element).find('.description').text().trim()
        const posterUrl = $(element).find('img').attr('src')
        const movieDetailUrl = $(element).find('.btn_link').attr('href')
        const webId = movieDetailUrl && movieDetailUrl.slice(17, 27)

        const existingMovie = await Movie.findByPk(webId)
        if (!existingMovie) {
          newMovies.push({
            webId,
            name,
            nameEn,
            duration,
            description,
            posterUrl,
            movieDetailUrl
          })
        }
      }

      const movies = await Movie.bulkCreate(newMovies)
      return movies
    } catch (err) {
      next(err)
    }
  },

  postScreenings: async (req, res, next) => {
    try {
      const response = await axios.get(MIRAMAR_URL)
      const html = response.data
      const $ = cheerio.load(html)
      const newScreenings = []

      for (const element of $('section:not(#inav, #page_top, .page_title, #footer)').toArray()) {
        const dateBlocks = $(element).find('.block').not('.booking_date_area')
        for (const blockElement of dateBlocks.toArray()) {
          const movieWebId = $(blockElement).attr('class').split(' ')[1]
          const dateString = $(blockElement).attr('class').split(' ').pop()
          const date = getDate(dateString)
          const room = $(blockElement).find('.room').text().trim().slice(11)
          const movie = await Movie.findByPk(movieWebId, { include: [Screening] })
          const times = []
          $(blockElement).find('.time_area .booking_time').each((i, timeElement) => {
            times.push($(timeElement).text())
          })
          times.forEach(time => {
            if (movie && !movie.Screenings.some(screening => screening.date === date && screening.time === time)) {
              newScreenings.push({
                movieWebId,
                date,
                room,
                time
              })
            }
          })
        }
      }

      const screenings = await Screening.bulkCreate(newScreenings)
      return screenings
    } catch (err) {
      next(err)
    }
  }

}

module.exports = movieController
