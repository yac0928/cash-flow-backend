'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const levels = ['none', 'bronze', 'silver', 'gold', 'platinum', 'diamond']
    await queryInterface.bulkInsert('Subscriptions',
      Array.from({ length: levels.length }, (_, i) => ({
        level: levels[i],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subscriptions', {})
  }
}
