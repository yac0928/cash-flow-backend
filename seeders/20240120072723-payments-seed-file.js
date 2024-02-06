'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const methods = ['cash', 'credit-card', 'debit-card', 'line-pay', 'paypal', 'transfer-out']
    await queryInterface.bulkInsert('Payments',
      Array.from({ length: methods.length }, (_, i) => ({
        name: methods[i],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Payments', {})
  }
}
