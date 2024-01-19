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
  },
  postCategory: (req, res, next) => {
    const { name, icon } = req.body
    if (!name) throw new Error('Name is required!')
    return Category.create({
      name,
      icon
    })
      .then(newCategory => res.json({ newCategory }))
      .catch(err => next(err))
  }
}
module.exports = categoryController
