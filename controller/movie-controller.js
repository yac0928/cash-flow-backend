const { Movie, Screening } = require('../models')
const { postMovies, postScreenings } = require('../utils/movieUtils')

const movieController = {
  getMovies: (req, res, next) => {
    return Movie.findAll({ include: [Screening] })
      .then(movies => res.json({ movies }))
      .catch(err => next(err))
  },
  postMoviesAndScreenings: async (req, res, next) => {
    try {
      const movies = await postMovies()
      const screenings = await postScreenings()
      res.json({ movies, screenings })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = movieController
