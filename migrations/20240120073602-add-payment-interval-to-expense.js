'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'payment_years', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Expenses', 'payment_per_month', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Expenses', 'payment_years')
    await queryInterface.removeColumn('Expenses', 'payment_per_month')
  }
}
