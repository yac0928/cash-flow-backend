'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const names = ['Entertainment', 'Transportation', 'Education', 'Health', 'Sports']
    const icons = ['fa-plane', 'fa-car', 'fa-book', 'fa-hospital', 'fa-dumbbell']
    await queryInterface.bulkInsert('Categories',
      Array.from({ length: names.length }, (_, i) => ({
        name: names[i],
        icon: icons[i],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
