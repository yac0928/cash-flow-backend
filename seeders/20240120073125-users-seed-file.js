'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const subscriptions = await queryInterface.sequelize.query('SELECT * FROM Subscriptions', {
      type: Sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      is_admin: true,
      subscription_id: subscriptions[Math.floor(Math.random() * subscriptions.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      is_admin: false,
      subscription_id: subscriptions[Math.floor(Math.random() * subscriptions.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
