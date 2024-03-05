'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT * FROM Users', {
      type: Sequelize.QueryTypes.SELECT
    })
    const categories = await queryInterface.sequelize.query('SELECT * FROM Categories LIMIT 4', {
      type: Sequelize.QueryTypes.SELECT
    })

    const userCategoryData = []
    users.forEach(user => {
      categories.forEach(category => {
        userCategoryData.push({
          user_id: user.id,
          category_id: category.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      })
    })

    await queryInterface.bulkInsert('UserCategories', userCategoryData, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserCategories', {})
  }
}
