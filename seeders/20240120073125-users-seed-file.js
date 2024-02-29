'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      is_admin: true,
      subscription_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      is_admin: false,
      subscription_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '12345678',
      email: '12345678',
      is_admin: true,
      subscription_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
