const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll()
      .then(categories => res.json({ categories }))
      .catch(err => next(err))
  }
}
module.exports = categoryController
