'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = [
      { name: 'Entertainment', icon: 'fa-plane' },
      { name: 'Transportation', icon: 'fa-car' },
      { name: 'Education', icon: 'fa-book' },
      { name: 'Others', icon: 'fa-ellipsis' },
      { name: 'Health', icon: 'fa-hospital' },
      { name: 'Sports', icon: 'fa-dumbbell' }
    ]
    const names = categories.map(item => item.name)
    const icons = categories.map(item => item.icon)
    await queryInterface.bulkInsert('Categories',
      Array.from({ length: categories.length }, (_, i) => ({
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
