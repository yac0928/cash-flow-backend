const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll()
      .then(categories => res.json({ categories }))
      .catch(err => next(err))
  },
  getCategory: (req, res, next) => {
    const { cid } = req.params
    return Category.findByPk(cid)
      .then(category => res.json({ category }))
      .catch(err => next(err))
  }
}
module.exports = categoryController
