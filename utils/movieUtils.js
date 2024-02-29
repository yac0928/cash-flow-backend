const axios = require('axios')
const cheerio = require('cheerio')
const { Movie, Screening } = require('../models')
const { getDate } = require('../helpers/get-date')

const MIRAMAR_URL = 'https://www.miramarcinemas.tw/timetable'

const postMovies = async () => {
  try {
    const response = await axios.get(MIRAMAR_URL)
    const html = response.data
    const $ = cheerio.load(html)
    const newMovies = []

    const existingMovies = await Movie.findAll()
    const existingMovieWebIds = existingMovies.map(movie => movie.webId)

    for (const element of $('section:not(#inav, #page_top, .page_title, #footer)').toArray()) {
      const name = $(element).find('.title').text().trim()
      const nameEn = $(element).find('.title_en').text().trim()
      const duration = $(element).find('.time').text().trim()
      const description = $(element).find('.description').text().trim()
      const posterUrl = $(element).find('img').attr('src')
      const movieDetailUrl = $(element).find('.btn_link').attr('href')
      const webId = movieDetailUrl && movieDetailUrl.slice(17, 27)
      const existingMovie = existingMovies.find(movie => movie.webId === webId)
      if (existingMovie) {
        if (existingMovie.movieDetailUrl !== movieDetailUrl) {
          await Movie.update(
            { movieDetailUrl },
            { where: { webId } }
          )
        }
        existingMovieWebIds.splice(existingMovieWebIds.indexOf(webId), 1)
      } else {
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
    for (const webId of existingMovieWebIds) {
      await Movie.destroy({ where: { webId } })
    }
    const movies = await Movie.bulkCreate(newMovies)
    return movies
  } catch (err) {
    return err
  }
}

const postScreenings = async () => {
  try {
    const response = await axios.get(MIRAMAR_URL)
    const html = response.data
    const $ = cheerio.load(html)
    const newScreenings = []

    const existingScreenings = await Screening.findAll()
    const existingScreeningsMap = existingScreenings.reduce((acc, screening) => {
      acc[`${screening.movieWebId}-${screening.date.toISOString()}-${screening.time}`] = screening.id
      return acc
    }, {})

    for (const element of $('section:not(#inav, #page_top, .page_title, #footer)').toArray()) {
      const dateBlocks = $(element).find('.block').not('.booking_date_area')
      for (const blockElement of dateBlocks.toArray()) {
        const movieWebId = $(blockElement).attr('class').split(' ')[1]
        const dateString = $(blockElement).attr('class').split(' ').pop()
        const date = getDate(dateString).toISOString()
        const room = $(blockElement).find('.room').text().trim().slice(11)
        const movie = await Movie.findByPk(movieWebId, { include: [Screening] })
        const times = []
        $(blockElement).find('.time_area .booking_time').each((i, timeElement) => {
          times.push($(timeElement).text())
        })
        times.forEach(time => {
          if (!movie || (movie && !movie.Screenings.some(screening => screening.date.toISOString() === date && screening.time === time))) {
            newScreenings.push({
              movieWebId,
              date,
              room,
              time
            })
          } else {
            delete existingScreeningsMap[`${movieWebId}-${date}-${time}`]
          }
        })
      }
    }
    for (const screeningId of Object.values(existingScreeningsMap)) {
      await Screening.destroy({ where: { id: screeningId } })
    }

    const screenings = await Screening.bulkCreate(newScreenings)
    return screenings
  } catch (err) {
    return err
  }
}

module.exports = { postMovies, postScreenings }
