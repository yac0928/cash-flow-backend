const { Movie, Screening } = require('../models')
const { postMovies, postScreenings } = require('../utils/movieUtils')
const { getOrSetCache, deleteCache } = require('../helpers/redis-helpers')
const movieController = {
  getMovies: async (req, res, next) => {
    try {
      const movies = await getOrSetCache('movies', async () => {
        const movies = await Movie.findAll({ include: [Screening] })
        return movies
      })
      res.json({ movies })
    } catch (error) {
      next(error)
    }
  },
  postMoviesAndScreenings: async (req, res, next) => {
    try {
      const movies = await postMovies()
      const screenings = await postScreenings()
      deleteCache('movies')
      res.json({ movies, screenings })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = movieController
